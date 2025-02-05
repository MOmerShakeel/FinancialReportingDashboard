import "./Statistics.css"
function Statistics() {
    return (
        <>
            <div class="ag-format-container">
                <div class="ag-courses_box">
                    <div class="ag-courses_item">
                        <a href="#" class="ag-courses-item_link">
                            <div class="ag-courses-item_bg"></div>

                            <div class="ag-courses-item_title">
                            Total Reserves = ${sumTotalReserves}
                            </div>

                            <div class="ag-courses-item_date-box">
                                Start:
                                <span class="ag-courses-item_date">
                                    04.11.2022
                                </span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Statistics;