"use client"
import { getPurchasedTeaLotSummary } from '@/redux/action/teaLotDetailsAction';
import { AppDispatch, RootState } from '@/redux/store';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function PurchasedLots() {
  const dispatch = useDispatch<AppDispatch>();
  const purchasedSummary = useSelector((state: RootState) => state.lotDetails.purchasedSummaryData.purchasedSummary.lotsByMonth);
  const pData = purchasedSummary?.map((i) => i.purchasedLots)
  const xLabels = purchasedSummary?.map((i) => i.month)
  useEffect(() => {dispatch(getPurchasedTeaLotSummary())}, [])
  return (
    <>
    <BarChart
      series={[
        { data: pData, label: 'Purchased Tea Lots', id: 'pvId', stack: 'total', color: "#005893" },
      ]}
      xAxis={[{ data: xLabels, scaleType: 'band', }]}
      slotProps={{
        legend:{hidden:true,  },
        axisLine:{display:"none"},
        axisTick:{display:"none"},
      }} 
    />
    </>
  );
}