import React from 'react';
import TableBody from './tableBody';
import TableHeader from './tableHeader';

const Table = ({movieArray,columns,sortColumn,onSort})=> {
    return ( 
        <table className="table">
        <TableHeader
          columns={columns}
          sortColumn={sortColumn}
          onSort={onSort}
        />
        <TableBody columns={columns} data={movieArray} />
      </table>
     );
}

export default Table ;