import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
var _ = require('lodash');
const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
}));

const SpanningTable = ({ rowTableData, columnsTableData, filterSelected, columnData }) => {
  console.log(rowTableData, columnsTableData, filterSelected, columnData);
  let tableRowHead = [];
  let tableColumnHead = [];

  const classes = useStyles();
  let colSpan = 0;
  let rowSpan = 0
  var keyFilter = '';
  if (filterSelected.value) {
    var findIndex = Object.keys(columnData[0]).findIndex(item2 => {
      return item2 === filterSelected.key
    })
    if (findIndex > -1) {
      keyFilter = Object.keys(columnData[0])[findIndex];
    }
  }
  if (rowTableData['namesonTop'] && rowTableData['namesonTop'].length) {
    rowSpan = rowTableData['namesonTop'].length;
    rowTableData["itemsInRow"] = [];
    tableRowHead = [...rowTableData.namesonTop];

    rowTableData['namesonTop'].forEach(item2 => {
      columnData.forEach(item => {
        if (keyFilter) {
          if ((item[keyFilter] === filterSelected.value)) {
            rowTableData['itemsInRow'].push({ key: item2, value: item[item2] })
          }
        }
        else {
          rowTableData['itemsInRow'].push({ key: item2, value: item[item2] })
        }

      });
    });

    rowTableData['itemsInRow'] = _.uniqBy(rowTableData['itemsInRow'],function(item){
      return item.value;
    })

  }
  if (columnsTableData['namesonTop'] && columnsTableData['namesonTop'].length) {
  columnsTableData["itemsInColumn"] = [];
    tableColumnHead = [...columnsTableData.namesonTop];

    columnsTableData['namesonTop'].forEach(item2 => {
      columnData.forEach(item => {
        if (keyFilter) {
          if ((item[keyFilter] === filterSelected.value)) {
            columnsTableData['itemsInColumn'].push({ key: item2, value: item[item2] })
          }
        }
        else {
          columnsTableData['itemsInColumn'].push({ key: item2, value: item[item2] })
        }

      });
    });
    columnsTableData['itemsInColumn'] = _.uniqBy(columnsTableData['itemsInColumn'],function(item){
      return item.value;
    })
    colSpan += columnsTableData['itemsInColumn'] && columnsTableData['itemsInColumn'].length ? columnsTableData['itemsInColumn'].length : 0;
  }


  if (!(tableRowHead.length || tableColumnHead.length)) {
    return <span></span>
  }


  return (

    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader className={classes.table} aria-label="spanning table">
          <TableHead>
            {tableColumnHead.length ?
              <TableRow colSpan={rowSpan + colSpan + 1}>
                <TableCell colSpan={rowSpan}/>
                <TableCell align="left" colSpan={colSpan}>
                  {tableColumnHead.join(', ')}</TableCell>
              </TableRow>
              : null
            }
            <TableRow>
              <TableCell colSpan={rowSpan}>{tableRowHead.join(', ')}</TableCell>
            {
              columnsTableData['itemsInColumn'] && columnsTableData['itemsInColumn'].length ?
                columnsTableData.itemsInColumn.map((item, index) => {
                  return (<TableCell key={`${item}-${index}`}>{item.value}</TableCell>)
                }) : null
            }
</TableRow>
          </TableHead>
          <TableBody>
            {rowTableData['itemsInRow'] && rowTableData['itemsInRow'].length ?
              rowTableData['itemsInRow'].map((row, index) => (
                <TableRow hover key={`row-${index}`}>
                  <TableCell colSpan={colSpan + rowSpan}>{row.value}</TableCell>
                </TableRow>
              )) : null}

          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}
export default SpanningTable;
