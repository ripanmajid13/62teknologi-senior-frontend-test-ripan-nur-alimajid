import React, { useEffect, useMemo, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";
import { CCard, CCardBody, CCardHeader, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { CircularProgress } from '@mui/material';
import { useTable, usePagination, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'

const Business = () => {
  const path = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search';
  const navigate = useNavigate();
  const [error, setError] = useState(false)
  const [result, setResult] = useState([])

  const data = useMemo(() => result, [result])
  const columns = useMemo(() => [
    {
      Header: '#',
      accessor: '#',
      Cell: ({ row, rows }) => rows.indexOf(row)+1
    },
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Phone',
      accessor: 'phone',
    },
    {
      Header: 'Price',
      accessor: 'price',
    },
    {
      Header: 'Rating',
      accessor: 'rating',
    },
    {
      Header: '',
      accessor: 'actions',
      Cell: ({ row: { original } }) => { 
        return <button onClick={() => navigate('/' + original.id, {
          replace: true,
          state: original
        })}>Detail</button>
      }
    }
  ], [])
  const filterTypes = useMemo(() => ({
    text: (rows, id, filterValue) => {
      return rows.filter(row => {
        const rowValue = row.values[id]
        return rowValue !== undefined
          ? String(rowValue)
            .toLowerCase()
            .startsWith(String(filterValue).toLowerCase())
          : true
      })
    },
  }), [])
  const defaultColumn = useMemo(() => ({
    Filter: ({ column: { filterValue, preFilteredRows, setFilter } }) => {
      const count = preFilteredRows.length

      return (
        <input
          value={filterValue || ''}
          onChange={e => {
            setFilter(e.target.value || undefined)
          }}
          placeholder={`Search ${count} records...`}
          style={{ backgroundColor: '#FFFFFF', color: '#000000', borderRadius: '5px', borderWidth: '1px', padding: '5px', marginTop: '5px', marginBottom: '5px' }}
        />
      )
    },
  }), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, 
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: {
      globalFilter,
      pageIndex,
      pageSize
    },
  } = useTable(
    {
      columns,
      data,
      defaultColumn, 
      filterTypes,
      initialState: {
        pageSize: 5
      }
    },
    useFilters, 
    useGlobalFilter,
    usePagination
  )

  useEffect(() => {
    let mounted = true;
    const getData = async () => {
      await Axios.get(path, {
        params: {
          'limit': 20,
          'location': 'ID'
        },
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer Ubf1-f0uqsJUnssqPMGo-tiFeZTT85oFmKfznlPmjDtX8s83jYMoAb-ApuD63wgq6LDZNsUXG6gurZIVYaj2jzxJmmLdCdXbDqIHU_b6KiCEVi8v-YB0OSsW6MWaY3Yx',
        },
      })
      .then((response) => mounted && setResult(response.data.businesses))
      .catch((error) => mounted && setError(true))
    }
    getData()
    return () => mounted = false
  }, []);

  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <CCard color='success' textColor='white' style={{ width: '60rem', padding: 0 }}>
      <CCardHeader>Business</CCardHeader>
      
      <CCardBody>
        {error ? (
          <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <p>Error</p>
            <p>Klik <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">Disini</a></p>
            <p>Lalu klik button <button>Request temporary access to the demo server</button></p>
            <p>Lalu klik <button onClick={() => window.location.reload()}>Refresh</button></p>
          </div>
        ) : (
          result.length < 1 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress color="inherit" /> &nbsp; Loading ...
            </div>
            ) : (
            <>
              <CTable {...getTableProps()} responsive hover bordered small style={{ marginBottom: 0 }}>
                <CTableHead>
                  {headerGroups.map(headerGroup => (
                    <CTableRow {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <CTableHeaderCell {...column.getHeaderProps()} style={{
                          color: 'white',
                          textAlign: 'center'
                        }}>
                          {column.render('Header')}
                          {column.id !== "#" && column.id !== "actions" && <div>{column.canFilter ? column.render('Filter') : null}</div>}
                        </CTableHeaderCell>
                      ))}
                    </CTableRow>
                  ))}
                      
                  <CTableRow>
                    <CTableHeaderCell colSpan={visibleColumns.length} sx={{ textAlign: 'left', border: '1px solid rgba(224, 224, 224, 1)', fontWeight: 'bold' }}>      
                      <span>
                        Search:{' '}
                        <input
                          value={value || ""}
                          onChange={e => {
                            setValue(e.target.value);
                            onChange(e.target.value);
                          }}
                          placeholder={`${preGlobalFilteredRows.length} records...`}
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#000000',
                            borderRadius: '5px',
                            borderWidth: '1px',
                            padding: '5px',
                          }}
                        />
                      </span>
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                    
                <CTableBody {...getTableBodyProps()}>
                  {page.slice(0, 10).map((row, i) => {
                    prepareRow(row)
                    return (
                      <CTableRow {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return <CTableDataCell {...cell.getCellProps()} style={{ color: 'white' }}>{cell.render('Cell')}</CTableDataCell>
                        })}
                      </CTableRow>
                    )
                  })}
                </CTableBody>
              </CTable>
              
              <div className="pagination" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                <div>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </div>
                    
                <div>
                  <button style={{ padding: '0.25em 1em' }} onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                  </button>{' '}
                  <button style={{ padding: '0.25em 1em' }} onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                  </button>{' '}
                  <button style={{ padding: '0.25em 1em' }} onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                  </button>{' '}
                  <button style={{ padding: '0.25em 1em' }} onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                  </button>
                </div>
              </div>
            </>
          )
        )}
      </CCardBody>
    </CCard>
  )
}

export default Business