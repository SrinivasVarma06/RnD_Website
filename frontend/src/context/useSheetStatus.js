import { useContext } from 'react';
import { SheetStatusContext } from './sheetStatusDef';

export function useSheetStatus() {
  return useContext(SheetStatusContext);
}
