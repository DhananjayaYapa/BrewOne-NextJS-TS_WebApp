// "use client";

import HeaderBar from "@/components/headerBar/headerBar"
import CatalogueTab from "@/components/catalogTab/catalogueTab"

type Props = { params: { view: number } }

export default async function CatalogueViewHome({ params }: Props) {

    return (
        <>
            
            <CatalogueTab id={params.view}/>
            
        </>


    )
}


