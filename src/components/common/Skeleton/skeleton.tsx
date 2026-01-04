import { Box, Skeleton } from '@mui/material';

export default function SkeletonBar() {
    return(
        <Box>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
        </Box>
    )
}
