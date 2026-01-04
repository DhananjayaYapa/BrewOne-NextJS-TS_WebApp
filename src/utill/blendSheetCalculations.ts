import {
  BlendBalance,
  SelectedWarehouseStock,
  BlendSFGItem,
  BOMItemDetail,
  OtherBOMItem,
  SelectedOtherItemLotStock,
} from "@/interfaces";

export const calculateAverageWeight = (
  selectedWarehouses: SelectedWarehouseStock[],
  selectedBlendBalances: BlendBalance[],
  selectedSFGItems: BlendSFGItem[],
  selectedOtherItem: SelectedOtherItemLotStock[]
): number => {
  const safeValue = (value: number): number =>
    value === Infinity || value === -Infinity || isNaN(value) ? 0 : value;

  // 👇 truncate to 3 decimals (no rounding)
  const toThreeDecimals = (num: number): number => Math.floor(num * 1000) / 1000;

  // qty part calculations
  const totalBlendSheetQty = selectedWarehouses.reduce((sum, item) => {
    return sum + (item?.selectedLot?.requiredQuantity || 0);
  }, 0);
  const blendBalanceQty = selectedBlendBalances.reduce((sum, item) => {
    return sum + (item?.quantity || 0);
  }, 0);
  const sfgItemsQty = selectedSFGItems.reduce((sum, item) => {
    return sum + (item?.quantity || 0);
  }, 0);
  const totalOtherItemQty = selectedOtherItem.reduce((sum, item) => {
    return sum + (item?.selectedLot?.quantity || 0);
  }, 0);

  // bags part calculations
  const totalBlendSheetBags = selectedWarehouses.reduce((sum, item) => {
    const qty = item?.selectedLot?.quantity || 0;
    const weight = item?.selectedLot?.weightPerBag || 0;
    return sum + safeValue(qty / weight);
  }, 0);
  const totalBlendBalanceBags = selectedBlendBalances.reduce((sum, item) => {
    const qty = item?.quantity || 0;
    const weight = item?.averageWeight || 0;
    return sum + safeValue(qty / weight);
  }, 0);
  const sfgItemsBags = selectedSFGItems.reduce((sum, item) => {
    const qty = item?.quantity || 0;
    const weight = item?.averageWeight || 0;
    return sum + safeValue(qty / weight);
  }, 0);
  const totalOtherItemsBags = selectedOtherItem.reduce((sum, item) => {
    const qty = item?.selectedLot?.requiredQuantity || 0;
    const weight = item?.selectedLot?.weightPerBag || 0;
    return sum + safeValue(qty / weight);
  }, 0);

  const totalQty =
    safeValue(totalBlendSheetQty) +
    safeValue(blendBalanceQty) +
    safeValue(sfgItemsQty) +
    safeValue(totalOtherItemQty);

  const totalBagWeight =
    safeValue(totalBlendSheetBags) +
    safeValue(totalBlendBalanceBags) +
    safeValue(sfgItemsBags) +
    safeValue(totalOtherItemsBags);

  const avgWeight =
    totalBagWeight === 0 ? 0 : safeValue(totalQty / totalBagWeight);

  // 👇 return truncated to 2 decimals
  return toThreeDecimals(avgWeight);
};

export const calculateAveragePricePerUnit = (
  selectedWarehouses: SelectedWarehouseStock[],
  selectedBlendBalances: BlendBalance[],
  selectedSFGItems: BlendSFGItem[],
  selectedOtherItem: SelectedOtherItemLotStock[]
): number => {
  const safeValue = (value: number): number =>
    value === Infinity || value === -Infinity || isNaN(value) ? 0 : value;

  //truncate to 3 decimals (no rounding)
  const toThreeDecimals = (num: number): number => Math.floor(num * 1000) / 1000;

  // value calculations
  const blendSheetItemsTotal = selectedWarehouses.reduce((sum, item) => {
    const quantity = item?.selectedLot?.requiredQuantity || 0;
    const price = item?.selectedLot?.price || 0;
    return sum + safeValue(quantity * price);
  }, 0);

  const blendBalanceTotal = (selectedBlendBalances || []).reduce(
    (sum, item) => {
      const quantity = item?.quantity || 0;
      const price = item?.price || 0;
      return sum + safeValue(quantity * price);
    },
    0
  );

  const sfgItemsTotal = (selectedSFGItems || []).reduce((sum, item) => {
    const quantity = item?.quantity || 0;
    const price = item?.price || 0;
    return sum + safeValue(quantity * price);
  }, 0);

  const otherItemsTotal = selectedOtherItem.reduce((sum, item) => {
    const quantity = item?.selectedLot?.requiredQuantity || 0;
    const price = item?.selectedLot?.price || 0;
    return sum + safeValue(quantity * price);
  }, 0);

  const totalAmount =
    safeValue(blendSheetItemsTotal) +
    safeValue(blendBalanceTotal) +
    safeValue(sfgItemsTotal) +
    safeValue(otherItemsTotal);

  // quantity calculations
  const blendSheetItemQty = selectedWarehouses.reduce((sum, item) => {
    return sum + safeValue(item?.selectedLot?.requiredQuantity || 0);
  }, 0);

  const blendBalanceQty = (selectedBlendBalances || []).reduce((sum, item) => {
    return sum + safeValue(item?.quantity || 0);
  }, 0);

  const sfgItemsQty = (selectedSFGItems || []).reduce((sum, item) => {
    return sum + safeValue(item?.quantity || 0);
  }, 0);

  const otherItemQty = selectedOtherItem.reduce((sum, item) => {
    return sum + safeValue(item?.selectedLot?.requiredQuantity || 0);
  }, 0);

  const totalQuantity =
    safeValue(blendSheetItemQty) +
    safeValue(blendBalanceQty) +
    safeValue(sfgItemsQty) +
    safeValue(otherItemQty);

  if (totalQuantity === 0) return 0;

  const avgPrice = safeValue(totalAmount / totalQuantity);

  // 👇 return truncated to 2 decimals
  return toThreeDecimals(avgPrice);
};

export const calculateWarehouseQuantity = (
  BOMItems: BOMItemDetail | null,
  selectedWarehouses: SelectedWarehouseStock[]
): number => {
  if (!BOMItems?.bomItems?.length || !selectedWarehouses?.length) return 0;

  const itemTotals = new Map<string, number>();

  selectedWarehouses.forEach((warehouseItem) => {
    const requiredQty = warehouseItem?.selectedLot?.requiredQuantity || 0;
    const currentTotal = itemTotals.get(warehouseItem.itemCode) || 0;
    itemTotals.set(warehouseItem.itemCode, currentTotal + requiredQty);
  });

  let minimum = Infinity;

  // Calculate ratio for each unique item
  itemTotals.forEach((totalRequiredQty, itemCode) => {
    const bomItem = BOMItems.bomItems.find((b) => b.code === itemCode);

    if (bomItem && bomItem.basedQuantity > 0) {
      const ratio = totalRequiredQty / bomItem.basedQuantity;

      if (ratio < minimum) {
        minimum = ratio;
      }
    }
  });

  return minimum === Infinity ? 0 : minimum;
};

export const calculateBlendQuantity = (
  selectedBlendBalances: BlendBalance[]
): number => {
  const blendQty = (selectedBlendBalances || []).reduce((sum, item) => {
    return sum + (item?.quantity || 0);
  }, 0);

  if (blendQty === 0) return 0;
  return blendQty;
};

export const calculateSFGQuantity = (
  selectedBlendItemBalances: BlendSFGItem[]
): number => {
  const sfgQty = (selectedBlendItemBalances || []).reduce((sum, item) => {
    return sum + (item?.quantity || 0);
  }, 0);

  if (sfgQty === 0) return 0;
  return sfgQty;
};

// export const calculateOtherQuantity = (
//   selectedOtherBlendItemBalances: OtherBlendItem[]
// ): number => {
//   return (selectedOtherBlendItemBalances || []).reduce((sum, item) => {
//     return sum + (item?.lots || []).reduce((lotSum, lot) => {
//       return lotSum + (lot?.quantity || 0);
//     }, 0);
//   }, 0);
// };

export const calculateOtherQuantity = (
  bomItems: SelectedOtherItemLotStock[]
): number => {
  return (bomItems || []).reduce((sum, item) => {
    return sum + (item.selectedLot?.requiredQuantity || 0);
  }, 0);
};

export const calculateTotalAllocatedQuantity = (
  selectedWarehouses: SelectedWarehouseStock[],
  BOMItems: BOMItemDetail | null,
  selectedBlendBalances: BlendBalance[],
  selectedBlendItemBalances: BlendSFGItem[],
  // selectedOtherBlendItemBalances: OtherBlendItem[]
  selectedOtherItem: SelectedOtherItemLotStock[]
): number => {
  const warehouseQty = calculateWarehouseQuantity(
    BOMItems,
    selectedWarehouses || []
  );
  const blendQty = calculateBlendQuantity(selectedBlendBalances || []);
  const sfgQty = calculateSFGQuantity(selectedBlendItemBalances || []);
  // const otherQty = calculateOtherQuantity(selectedOtherBlendItemBalances||[]);
  const otherQty = calculateOtherQuantity(selectedOtherItem || []);
  let totalQuantity = warehouseQty + blendQty + sfgQty + otherQty;

  if (totalQuantity === 0) return 0;
  return totalQuantity;
};

export const calculateAvailableQuantity = (
  BOMItems: BOMItemDetail | null,
  blendSheetHeaderForm: { plannedQuantity?: { value: number } } | null,
  selectedWarehouses: SelectedWarehouseStock[] | null
): string => {
  if (!BOMItems?.bomItems || !blendSheetHeaderForm?.plannedQuantity?.value)
    return "0.000";

  const overallPlanned = blendSheetHeaderForm.plannedQuantity.value;
  const plannedMap: { [code: string]: number } = {};

  BOMItems.bomItems.map((row, index) => {
    const planned = (row.basedQuantity || 0) * overallPlanned;
    plannedMap[row.code] = planned;
    return row;
  });

  let totalAvailable = 0;

  Object.keys(plannedMap).forEach((code) => {
    const planned = plannedMap[code];
    const matchingWarehouses = (selectedWarehouses || []).filter(
      (w) => w.itemCode === code
    );
    const totalUsed = matchingWarehouses.reduce((sum, w) => {
      const warehousePlanned = w.plannedQuantity || 0;
      const warehouseRemaining = w.remainingQuantity || 0;
      return sum + (warehousePlanned - warehouseRemaining);
    }, 0);
    const available = Math.max(0, planned - totalUsed);
    totalAvailable = available;
  });

  return totalAvailable.toFixed(3);
};
