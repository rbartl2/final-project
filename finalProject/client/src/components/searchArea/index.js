import React from "react";

const searchArea = (props) => {
    return(
        <div className="search-area">
            <form action="">
                <input onChange={props.handleSearch} type="text"/>
                <button type="submit">Search</button>
            </form>
        </div>
    )
}

export default searchArea;