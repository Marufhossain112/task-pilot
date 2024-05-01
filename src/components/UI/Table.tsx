"use client";

import { Table } from "antd";

type TPTableProps = {
  loading?: boolean;
  columns: any;
  dataSource: any;
  pageSize?: number;
  totalPages?: number;
  showSizeChanger?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  showPagination?: boolean;
};

const TPTable = (
  {
    //     loading = false,
    columns,
    dataSource,
    //     pageSize,
    //     totalPages,
    //     showSizeChanger = true,
    //     onPaginationChange,
    //     showPagination = true,
  }: TPTableProps
) => {
  // const paginationConfig = showPagination
  //     ? {
  //         pageSize: pageSize,
  //         total: totalPages,
  //         pageSizeOptions: [5, 10, 20],
  //         showSizeChanger: showSizeChanger,
  //         onChange: onPaginationChange,
  //     }
  //     : false;


  return (
    <Table
      // loading={loading}
      columns={columns}
      dataSource={dataSource}
    // pagination={paginationConfig}
    />
  );
};

export default TPTable;
