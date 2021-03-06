import React from 'react'

import moment from 'moment'

import { Cell } from 'fixed-data-table-2'

export default (props) => {
  const { results, row, index, offset, meta, digDeeper, ...cellProps } = props

  const rowColumns = results[row - offset]

  if (!rowColumns) {
    return (
      <Cell className='cell-body' {...cellProps}>
        ...
      </Cell>
    )
  }

  const value = rowColumns[index]

  let displayValue = value
  let className = ''
  let link = meta && meta.url ? meta.url.split(`{${meta.key}}`).join(value) : null

  if (value === true) {
    displayValue = 'true'
    className = 'boolean true'
  } else if (value === false) {
    displayValue = 'false'
    className = 'boolean false'
  }

  if (value && meta && (meta.type === 'time' || meta.type === 'date')) {
    if (meta.transform === 'day' || (!meta.transform && meta.type === 'date')) {
      displayValue = moment(value).format('YYYY-MM-DD')
    } else if (meta.transform === 'quarter') {
      displayValue = 'Q' + moment(value).format('Q YYYY')
    } else if (meta.transform === 'month') {
      displayValue = moment(value).format('YYYY-MM')
    }
  }

  if (meta && meta.aggregate) {
    return (
      <Cell {...cellProps} className='cell-body'>
        <span className='aggregate-link' onClick={() => digDeeper(row - offset)}>{displayValue}</span>
      </Cell>
    )
  }

  return (
    <Cell {...cellProps} className='cell-body'>
      {link
        ? <a href={link} target='_blank' className={className}>{displayValue}</a>
        : className
          ? <span className={className}>{displayValue}</span>
          : <span>{displayValue}</span>}
    </Cell>
  )
}
