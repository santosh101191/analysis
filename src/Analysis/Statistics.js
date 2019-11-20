
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import Select from '@material-ui/core/Select';
import './analysisStyle.css';


const extractData = require('../assets/dropdown.json');
const EXTRACT_STS = 4; //id of list to be shown in extract dropdown



export default class Statistics extends React.Component {

  constructor() {
    console.log(extractData);
    super();
    this.state = {
      extractSelected: '',
      filterSelected: '',
      hideFilter: false,
      columnData: [
        { name: 'Column1', id: 1 },
        { name: 'Column 2', id: 2 },
        { name: 'Column 3', id: 3 },
        { name: 'Column_4_whatever_long_name', id: 4 },
        { name: 'Column 5', id: 5 },
        { name: 'Column_6 Another Name', id: 6 },

      ],
    }
    this.renderExtractOptions = this.renderExtractOptions.bind(this);
    this.handleExtractChange = this.handleExtractChange.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.renderFilterOptions = this.renderFilterOptions.bind(this);
  }
  handleExtractChange(e) {
    this.setState({ extractSelected: e.target.value })
  }
  handleFilterChange(e) {
    this.setState({ filterSelected: e.target.value })
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (document.getElementById(data) && ev.target.id != data) {
      ev.target.appendChild(document.getElementById(data));
    }

  }
  toggleFilter(type) {
    console.log("type:", type)
    debugger;
    if (type == 'hide') {
      this.setState({ hideFilter: true })
    } else {
      this.setState({ hideFilter: false })
    }
  }
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    } else {
      const columnData = this.reorder(
        this.state.columnData,
        result.source.index,
        result.destination.index
      );

      this.setState({
        columnData
      });
    }
  }
  renderFilterOptions() {
    let filterOptions = [{
      name: 'Filter1',
      id: 1
    },
    {
      name: 'Filter2',
      id: 2
    },
    {
      name: 'Filter3',
      id: 3
    }
    ]
    let toRender = filterOptions.map((item, index) => {
      return (
        (<MenuItem key={`${item.name}-${index}`} value={item.name}>{item.name}</MenuItem>)
      )
    })

    return (
      <Select
        labelId="select-filter-label"
        id="select-filter1"
        style={{ width: "10em" }}
        value={this.state.filterSelected}
        onChange={(e) => { this.handleFilterChange(e) }}
      >{toRender}
      </Select>
    )
  }


  renderExtractOptions() {
    let extractOptions = extractData.filter(data => {
      return data.Ext_Sts == EXTRACT_STS;
    })

    let toRender = extractOptions.map((item, index) => {
      return (<MenuItem key={`${item.Ext_Disp_Name}-${index}`} value={item.Ext_Disp_Name}>{item.Ext_Disp_Name}</MenuItem>)
    })
    return (
      <Select
        labelId="select-extract-label"
        id="select-extract"
        style={{ width: "10em" }}
        value={this.state.extractSelected}
        onChange={(e) => { this.handleExtractChange(e) }}
      >{toRender}
      </Select>
    )
  }

  renderColumData() {
    let toRender = this.state.columnData.map((item, index) => {
      return (
        <div key={`${item.name}-${index}`} draggable="true" onDragStart={(ev) => { this.drag(ev) }} id={`${item.name}-${index}`} className="dragger">
          {item.name}
        </div>
      )
    })
    return (
      <div>
        <span><label>COLUMNS</label></span>
        <div className="columnListDropDown">

          <div id="dragzone-1" className="columnList" onDrop={(ev) => { this.drop(ev) }} onDragOver={this.allowDrop}>
            {toRender}
          </div>
        </div>
      </div>
    )

  }
  render() {
    return (
      <div>

        <div className="row">
          <div className="small-24 medium-12 large-24 column">

            <h2>Stats Per Completion</h2>
          </div>
          <div className="small-24 medium-12 large-4 column">
            <div className="gwos-package blank">
              <div className="gwos-board">
                <div className="gwos-board-body">
                  <span><label>EXTRACTS</label></span>
                  {this.renderExtractOptions()}

                  {this.state.hideFilter ? this.renderFilterOptions() : <div></div>}



                  {this.renderColumData()}

                </div>
              </div></div></div>

          <div className="small-24 medium-24 large-20 column">
            <div className="gwos-package blank">
              <div className="gwos-board">

                <div className="gwos-board-body">

                  <div className="  large-24 row">

                    <div className="large-8 column"><i className="fa fa-columns"></i> Columns <div id="dropzone-column" className="dropzone" onDrop={this.drop} onDragOver={this.allowDrop} placeholder="dropzone"></div></div>

                    <div className="large-8 column"><i className="fa fa-align-justify"></i> Rows <div id="dropzone-rows" className="dropzone" onDrop={this.drop} onDragOver={this.allowDrop}></div></div>

                    <div className="large-8 column"><i className="fa fa-filter"></i> Filters <div id="dropzone-filter" className="dropzone" onDragOver={(event) => { this.allowDrop(event) }} onDrop={(e) => { this.drop(e) && this.toggleFilter() }} onDragLeave={() => { this.toggleFilter('remove') }} ></div>
                    </div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


