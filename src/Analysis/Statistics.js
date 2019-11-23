
import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import Select from '@material-ui/core/Select';
import './analysisStyle.css';
import SpanningTable from './Table';
var _ = require('lodash');

const extractData = require('../assets/dropdown.json');
const columnJSON = require('../assets/columns.json');
const EXTRACT_STS = 4; //id of list to be shown in extract dropdown


let columnsTableData = {};
let rowTableData = {};
let filterOptions = [];
export default class Statistics extends React.Component {

  constructor() {
    console.log(extractData);
    super();
    this.state = {
      extractSelected: '',
      filterSelected: {
        value: '',
        key: ''
      },
      hideFilter: true,
      filterDataValues: [],
      columnsDataValues: [],
      rowDataValues: [],
      updateTable: false,
      columnData: columnJSON,
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
    let valueSelected = e.target.value;
    var findIndex = filterOptions.findIndex((item) => {
      return item.value = valueSelected;
    })
    if (findIndex > -1) {
      this.setState({ filterSelected: filterOptions[findIndex] });
    }
    console.log(this.state.filterSelected);
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  /**
   * called on dropping element
   * @param {event} ev 
   * @param {component this} _this 
   */
  drop(ev, _this) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    if (document.getElementById(data) && ev.target.id != data) {

      let dataAdded = document.getElementById(data).textContent //data that is dragged
      ev.target.appendChild(document.getElementById(data));
      _this.checkForValues(ev, dataAdded);
    }

  }
  resetTableData() {
    columnsTableData = {};
    rowTableData = {};
  }
  /**
   * update array values  of headerRow "Columns", "Rows", "Filters"
   * @param {event } ev 
   * @param {data dargged and dropped} dataAdded 
   */
  checkForValues(ev, dataAdded) {
    let headerRowValues = {
      filterDataValues: this.state.filterDataValues,
      columnsDataValues: this.state.columnsDataValues,
      rowDataValues: this.state.rowDataValues
    }
    this.resetTableData();
    let targetToAdd = ev.target.previousSibling; //to identify headerRow target 
    if (targetToAdd && targetToAdd.wholeText) {
      targetToAdd = targetToAdd.wholeText.trim()
    }
    let findIndexFilter = headerRowValues['filterDataValues'].findIndex(item => {
      return item == dataAdded;
    })
    let findIndexColumn = headerRowValues['columnsDataValues'].findIndex(item => {
      return item == dataAdded;
    })

    let findIndexRow = headerRowValues['rowDataValues'].findIndex(item => {
      return item == dataAdded;
    })

    switch (targetToAdd) {

      case "Rows":
        if (findIndexRow === -1) {
          headerRowValues['rowDataValues'].push(dataAdded);
        }
        if (findIndexColumn > -1) {
          headerRowValues['columnsDataValues'].splice(findIndexColumn, 1);
        }
        if (findIndexFilter > -1) {
          headerRowValues['filterDataValues'].splice(findIndexFilter, 1);
        }

        break;
      case "Columns":
        if (findIndexColumn === -1) {
          headerRowValues['columnsDataValues'].push(dataAdded);
        }
        if (findIndexRow > -1) {
          headerRowValues['rowDataValues'].splice(findIndexRow, 1);
        }
        if (findIndexFilter > -1) {
          headerRowValues['filterDataValues'].splice(findIndexFilter, 1);
        }
        break;
      case "Filters":
        if (findIndexFilter === -1) {
          headerRowValues['filterDataValues'].push(dataAdded);
        }
        if (findIndexRow > -1) {
          headerRowValues['rowDataValues'].splice(findIndexRow, 1);
        }
        if (findIndexColumn > -1) {
          headerRowValues['columnsDataValues'].splice(findIndexColumn, 1);
        }
        break;
      default:
        if (findIndexFilter > -1) {
          headerRowValues['filterDataValues'].splice(findIndexFilter, 1);
        }
        if (findIndexRow > -1) {
          headerRowValues['rowDataValues'].splice(findIndexRow, 1);
        }
        if (findIndexColumn > -1) {
          headerRowValues['columnsDataValues'].splice(findIndexColumn, 1);
        }
    }
    // updating values of headerRow
    const valuesToUpdate = ["filterDataValues", "rowDataValues", "columnsDataValues"];
    valuesToUpdate.forEach(item => {
      this.setState({ item: headerRowValues[item] });
    });
    console.log(headerRowValues);
    // showing filter based on values on headerRow Filter
    if (headerRowValues['filterDataValues'].length > 0) {
      this.setState({ hideFilter: false });
    }
    else {
      this.setState({ hideFilter: true });
      this.setState({ filterSelected: { key: '', value: '' } })
    }

    if (headerRowValues['rowDataValues'].length > 0) {

      rowTableData = {
        namesonTop: headerRowValues['rowDataValues'],
        itemsInRow: []
      }

      let updateTable = this.state.updateTable;
      this.setState({ updateTable: !updateTable });
    }
    if (headerRowValues['columnsDataValues'].length > 0) {

      columnsTableData = {
        namesonTop: headerRowValues['columnsDataValues'],
        itemsInColumn: []
      }
    }
  }

  renderFilterOptions() {

    let filterValues = [];
    this.state.filterDataValues.forEach(item2 => {
      this.state.columnData.forEach(item => {

        filterValues.push({ key: item2, value: item[item2] })
      });
      filterValues = _.uniqBy(filterValues, function (data) {
        return data.value;
      });
    });
    filterOptions = filterValues
    let toRender = filterOptions.map((item, index) => {
      return (
        (<MenuItem key={`${item.value}-${index}`} value={item.value}>{item.value}</MenuItem>)
      )
    })

    return (
      <div>
        <span><label>FILTERS</label></span>
        <Select
          labelId="select-filter-label"
          id="select-filter1"
          style={{ width: "10em" }}
          value={this.state.filterSelected.value}
          displayEmpty
          onChange={(e) => { this.handleFilterChange(e) }}
        >
          <MenuItem value="" disabled>
            Please Select
          </MenuItem>
          {toRender}
        </Select>
      </div>
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
        displayEmpty
        onChange={(e) => { this.handleExtractChange(e) }}
      >
        <MenuItem value="" disabled>
          Please Select
          </MenuItem>
        {toRender}
      </Select>
    )
  }

  renderColumData() {

    console.log(Object.keys(this.state.columnData[0]));
    let toRender = Object.keys(this.state.columnData[0]).map((item, index) => {
      return (
        <div key={`${item}-${index}`} draggable="true" onDragStart={(ev) => { this.drag(ev) }} id={`${item}-${index}`} className="dragger">
          {item}
        </div>
      )
    })
    return (
      <div>
        <span><label>COLUMNS</label></span>
        <div className="columnListDropDown">

          <div id="dragzone-1" className="columnList" onDrop={(ev) => { this.drop(ev, this) }} onDragOver={this.allowDrop}>
            {toRender}
          </div>
        </div>
      </div>
    )

  }
  render() {
    return (
      <div class="container">

        <div className="row" draggable >
          <div className="small-24 medium-12 large-24 column">

            <h2>Stats Per Completion</h2>
          </div>
          <div className="small-24 medium-12 large-4 column">
            <div className="gwos-package blank">
              <div className="gwos-board">
                <div className="gwos-board-body">
                  <span><label>EXTRACTS</label></span>
                  {this.renderExtractOptions()}

                  {this.state.hideFilter ? <div></div> : this.renderFilterOptions()}
                  {this.renderColumData()}

                </div>
              </div></div></div>

          <div className="small-24 medium-24 large-20 column">
            <div className="gwos-package blank">
              <div className="gwos-board">

                <div className="gwos-board-body">

                  <div className="  large-24 row">

                    <div className="large-8 column"><i className="fa fa-columns"></i> Columns <div id="dropzone-column" className="dropzone" onDrop={(e) => { this.drop(e, this) }} onDragOver={this.allowDrop} placeholder="dropzone"></div></div>

                    <div className="large-8 column"><i className="fa fa-align-justify"></i> Rows <div id="dropzone-rows" className="dropzone" onDrop={(e) => { this.drop(e, this) }} onDragOver={this.allowDrop}></div></div>

                    <div className="large-8 column"><i className="fa fa-filter"></i> Filters <div id="dropzone-filter" className="dropzone" onDragOver={(event) => { this.allowDrop(event) }} onDrop={(e) => { this.drop(e, this); }}>

                    </div>
                    </div>

                  </div>
                  <SpanningTable rowTableData={rowTableData} columnsTableData={columnsTableData} columnData={this.state.columnData} filterSelected={this.state.filterSelected} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    )
  }
}


