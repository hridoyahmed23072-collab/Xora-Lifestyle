import { useEffect, useState } from 'react';
import { DEFAULT_SETTINGS } from '../lib/constants';
import { storeService } from '../services/storeService';
import { StoreSettings } from '../types';

// Shared cache so every component reuses one fetch of the admin settings.
let cached: StoreSettings | null = null;
let inflight: Promise<StoreSettings> | null = null;

function load(): Promise<StoreSettings> {
  if (!inflight) {
    inflight = storeService
      .getSettings()
      .then((s) => {
        cached = { ...DEFAULT_SETTINGS, ...s };
        return cached;
      })
      .catch(() => {
        inflight = null;
        return DEFAULT_SETTINGS;
      });
  }
  return inflight;
}

export function useSettings(): StoreSettings {
  const [settings, setSettings] = useState<StoreSettings>(cached || DEFAULT_SETTINGS);
  useEffect(() => {
    let alive = true;
    load().then((s) => {
      if (alive) setSettings(s);
    });
    return () => {
      alive = false;
    };
  }, []);
  return settings;
}

// Turns 01XXXXXXXXX / +8801XXXXXXXXX / 8801XXXXXXXXX into 8801XXXXXXXXX for wa.me links.
export function toWhatsAppNumber(input: string): string {
  const digits = (input || '').replace(/[^0-9]/g, '');
  if (digits.startsWith('880')) return digits;
  if (digits.startsWith('0')) return '88' + digits;
  return '880' + digits;
}
