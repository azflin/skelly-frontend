import React from 'react';
import { useTable, useSortBy } from 'react-table';
import {NETWORK} from "../config";
import {Link} from "react-router-dom";

export default function MarketplaceActivityTable({marketplaceActivity}) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'ERC721 Contract',
        accessor: 'contractAddress',
        Cell: e => {
          return <a href={NETWORK.block_explorer_url + "address/" + e.value} target="_blank">{e.value}</a>;
        }
      },
      {
        Header: 'Token ID',
        accessor: 'tokenId',
      },
      {
        Header: 'Bid',
        accessor: 'bidPrice',
      },
      {
        Header: 'Offer',
        accessor: 'offerPrice',
      },
      {
        Header: 'Updated At',
        accessor: 'updatedAt',
      },
      {
        Header: "View",
        Cell: ({row}) => {
          console.log("ROW", row);
          return (
            <Link to={`/collection/${row.values.contractAddress}/${row.values.tokenId}`}>
             <button>Go</button>
          </Link>)
        }
      }
    ],
    []
  )
  const tableInstance = useTable({columns, data: marketplaceActivity}, useSortBy);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div>
      <h3>Recent Marketplace Activity</h3>
      <table {...getTableProps()} style={{borderSpacing: "5px"}}>
        <thead>
          {
          headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {
              headerGroup.headers.map(column => (
                // Add column header sorting
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' ↓'
                          : ' ↑'
                        : ' ↕'}
                    </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {
          rows.map(row => {
            prepareRow(row);
            return (
              <tr key={row.id}>
                {
                row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}