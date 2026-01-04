"use client";
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';
import { getCataloguesSummary } from '@/redux/action/catalogueAction';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import SkeletonBar from '@/components/common/Skeleton/skeleton';
  
const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
    fontFamily:"'__Roboto_bd870a', '__Roboto_Fallback_bd870a'"
}));

function PieCenterLabel({ children }: { children?: React.ReactNode }) {
  const totalCatalogFiles = useSelector((state: RootState) => state.catalogue.catalogueSummaryData.catalogueSummary.totalCatalogFiles);
    const { width, height, left, top } = useDrawingArea();
    return (
    <StyledText x={left + width / 2} y={top + height / 2} fontWeight={"500"}>
        <tspan x={left + width / 2} dy="-0.5em" fontSize="22px" fontWeight="600">{totalCatalogFiles}</tspan>
        <tspan x={left + width / 2} dy="1.8em" fontSize="14px" fontWeight="500" fill='#5F6D7E'>Files</tspan>
    </StyledText>
    );
  }

export default function CatalogueSummary() {
  const dispatch = useDispatch<AppDispatch>();
  const statuses = useSelector((state: RootState) => state.catalogue.catalogueSummaryData.catalogueSummary.statuses);
  const isLoading = useSelector((state: RootState) => state.catalogue.catalogueSummaryData.isLoading);
  const hasError = useSelector((state: RootState) => state.catalogue.catalogueSummaryData.hasError);
  const activeStatus = statuses.find((i) => i.statusId === 1);
  const closedStatus = statuses.find((i) => i.statusId === 2);
  useEffect(() => {dispatch(getCataloguesSummary())}, [])

  const data = [
    { 
      value: activeStatus ? activeStatus.count : 0, 
      label: `${activeStatus ? activeStatus.count : 0}\nOpen`, 
      color:'#005893' 
    },
    { 
      value: closedStatus ? closedStatus.count : 0, 
      label: `${closedStatus ? closedStatus.count : 0}\nClosed`, 
      color:  '#EAEBF0' 
    },
  ];
  
    return (
      <>
      {isLoading ? (
        <SkeletonBar />
        ) : hasError ? (
        <p>Error</p>
        ) : (
          <PieChart
            margin={{ top: 100, bottom: 100, left: 100, right:100 }}
            series={[{ data, innerRadius: 75 }]}
            slotProps={{
                legend: {
                    direction: 'row',
                    position: { vertical: 'bottom', horizontal: 'middle' },
                    padding: 10,
                    itemGap: 35,
                }
            }}
          >
            <PieCenterLabel/>
          </PieChart>
        )
      }
      </>
    );
}

 
