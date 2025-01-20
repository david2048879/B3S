

const SidebarItems = {
    OPERATOR: {
        items: [
            {
                title: "PERFORMANCE",
                icon: <i className="fa-solid fa-chart-simple mx-2" ></i>,
            },
            {
                title: "SCAN",
                icon: <i className="fa-solid fa-home mx-2" ></i>,
            },
            {
                title: "SCANNED COPIES",
                icon: <i className="fa-solid fa-qrcode mx-2" ></i>,
            },
            // {
            //     title: "DOCUMENT TYPE",
            //     icon: <i className="fa-solid fa-folder mx-2" ></i>,
            // },
            
        ]
    },
    ADMIN: {
        items: [
            {
                title: "SCAN",
                icon: <i className="bi bi-view-stacked mx-2"></i>,
            },
            {
                title: "ORGANIZATION SCANNED COPIES",
                icon: <i class="bi bi-collection mx-2"></i>
            },
            {
                title: "DOCUMENT TYPE",
                icon: <i class="bi bi-collection mx-2"></i>,
            },
            {
                title: "ADD NEW DOCUMENT TYPE",
                icon: <i class="bi bi-collection mx-2"></i>,
            },
            {
                title: "USER MANAGEMENT",
                icon: <i class="bi bi-collection mx-2"></i>,
            },
        ]
    },
    STAFF: {
        items: [
            {
                title: "ALL SCANNED COPIES",
                icon: <i class="bi bi-collection mx-2"></i>
            },
        ]
    }
}

const getNavbarItems=(role)=>{
    console.log("ROLEEEEE",role);
    
    return SidebarItems[role].items || []
}

export default getNavbarItems;