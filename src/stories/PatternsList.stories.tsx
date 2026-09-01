import { useState } from 'react'
import type { UIEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox } from 'lucide-react'
import { SearchActionBar } from '../components/SearchActionBar'
import { EmptyState } from '../components/EmptyState'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'

const meta: Meta = {
  title: '패턴/목록',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

interface AssetRow {
  id: string
  name: string
  category: string
}

const allRows: AssetRow[] = [
  { id: '1', name: '강남 오피스텔', category: '부동산' },
  { id: '2', name: '판교 아파트', category: '부동산' },
]

interface UserRow {
  id: string
  name: string
  role: string
}

const manyRows: UserRow[] = Array.from({ length: 42 }, (_, i) => ({
  id: String(i + 1),
  name: `사용자 ${i + 1}`,
  role: i % 3 === 0 ? '관리자' : '일반',
}))

const userColumns = [
  { key: 'name', header: '이름', render: (row: UserRow) => row.name },
  {
    key: 'role',
    header: '권한',
    render: (row: UserRow) => <Badge variant={row.role === '관리자' ? 'brand' : 'neutral'}>{row.role}</Badge>,
  },
]

/**
 * 검색 없이 그리드만 페이지 단위로 넘겨 보는 목록 패턴: 총 건수 + 그리드 + 페이지네이션(페이지당 개수 포함).
 * 필터링할 게 없는 고정 목록(설정값, 코드 테이블 등)에 쓴다.
 */
export const 목록페이징: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const totalPages = Math.max(1, Math.ceil(manyRows.length / pageSize))
    const pageRows = manyRows.slice((page - 1) * pageSize, page * pageSize)

    return (
      <div className="flex flex-col gap-2">
        <Table<UserRow> columns={userColumns} rows={pageRows} getRowId={(row) => row.id} />
        <div className="flex items-center justify-between">
          <span className="text-xs text-[var(--ds-text-subtle)]">총 {manyRows.length.toLocaleString()}건</span>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            itemsPerPage={pageSize}
            onItemsPerPageChange={(size) => {
              setPageSize(size)
              setPage(1)
            }}
          />
        </div>
      </div>
    )
  },
}

/**
 * 목록페이징 위에 검색/필터 영역까지 얹은 완전한 목록 패턴: 검색바 + 그리드 + (총 건수·페이지네이션).
 * 검색바에는 총 건수를 넣지 않는다 — 검색바와 그리드는 붙여서 하나의 덩어리로 보이게 하고,
 * 총 건수는 페이지네이션과 같은 줄, 좌측에 둔다(페이지네이션은 그 줄의 우측에 뭉쳐서 정렬).
 * 검색 결과가 없으면 그리드·하단 줄 대신 EmptyState로 대체한다.
 */
export const 목록페이징검색: Story = {
  render: () => {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const filtered = query ? manyRows.filter((r) => r.name.includes(query)) : manyRows
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

    return (
      <div className="flex flex-col gap-2">
        <SearchActionBar
          searchPlaceholder="이름으로 검색..."
          onSearch={(q) => {
            setQuery(q)
            setPage(1)
          }}
        />
        {filtered.length === 0 ? (
          <EmptyState icon={<Inbox size={32} />} title="검색 결과가 없습니다" />
        ) : (
          <>
            <Table<UserRow> columns={userColumns} rows={pageRows} getRowId={(row) => row.id} />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--ds-text-subtle)]">총 {filtered.length.toLocaleString()}건</span>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                itemsPerPage={pageSize}
                onItemsPerPageChange={(size) => {
                  setPageSize(size)
                  setPage(1)
                }}
              />
            </div>
          </>
        )}
      </div>
    )
  },
}

const SCROLL_LOAD_THRESHOLD_PX = 32
const SCROLL_PAGE_SIZE = 10

/**
 * 목록페이징과 같은 데이터를 페이지 번호 대신 스크롤로 이어서 불러오는 목록 패턴: 스크롤 그리드 + 총 건수.
 * 페이지네이션 번호/페이지당 개수 선택 없이, 그리드 컨테이너 하단 근처까지 스크롤하면 다음 구간이 이어서 로드된다.
 * 헤더는 스크롤 컨테이너 상단에 고정(stickyHeader)해서 계속 보이게 한다.
 */
export const 목록스크롤: Story = {
  render: () => {
    const [visibleCount, setVisibleCount] = useState(SCROLL_PAGE_SIZE)
    const rows = manyRows.slice(0, visibleCount)

    function handleScroll(e: UIEvent<HTMLDivElement>) {
      if (visibleCount >= manyRows.length) return
      const el = e.currentTarget
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_LOAD_THRESHOLD_PX) {
        setVisibleCount((prev) => Math.min(prev + SCROLL_PAGE_SIZE, manyRows.length))
      }
    }

    return (
      <div className="flex flex-col gap-2">
        <Table<UserRow>
          columns={userColumns}
          rows={rows}
          getRowId={(row) => row.id}
          stickyHeader
          maxHeightClass="max-h-80"
          onScroll={handleScroll}
        />
        <span className="text-xs text-[var(--ds-text-subtle)]">총 {manyRows.length.toLocaleString()}건</span>
      </div>
    )
  },
}

/** 목록스크롤 위에 검색 영역까지 얹은 패턴: 검색바 + 스크롤 그리드 + 총 건수. */
export const 목록스크롤검색: Story = {
  render: () => {
    const [query, setQuery] = useState('')
    const [visibleCount, setVisibleCount] = useState(SCROLL_PAGE_SIZE)

    const filtered = query ? manyRows.filter((r) => r.name.includes(query)) : manyRows
    const rows = filtered.slice(0, visibleCount)

    function handleScroll(e: UIEvent<HTMLDivElement>) {
      if (visibleCount >= filtered.length) return
      const el = e.currentTarget
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_LOAD_THRESHOLD_PX) {
        setVisibleCount((prev) => Math.min(prev + SCROLL_PAGE_SIZE, filtered.length))
      }
    }

    return (
      <div className="flex flex-col gap-2">
        <SearchActionBar
          searchPlaceholder="이름으로 검색..."
          onSearch={(q) => {
            setQuery(q)
            setVisibleCount(SCROLL_PAGE_SIZE)
          }}
        />
        {filtered.length === 0 ? (
          <EmptyState icon={<Inbox size={32} />} title="검색 결과가 없습니다" />
        ) : (
          <>
            <Table<UserRow>
              columns={userColumns}
              rows={rows}
              getRowId={(row) => row.id}
              stickyHeader
              maxHeightClass="max-h-80"
              onScroll={handleScroll}
            />
            <span className="text-xs text-[var(--ds-text-subtle)]">총 {filtered.length.toLocaleString()}건</span>
          </>
        )}
      </div>
    )
  },
}

/**
 * 그리드/목록이 비어있을 때의 빈 상태. 검색바는 별도(패턴/검색)에서 다루므로 여기서는 다루지 않고,
 * 데이터가 0건일 때 그리드 자리를 EmptyState로 대체하는 모양 자체만 본다.
 */
export const 빈검색결과: Story = {
  render: () => <EmptyState icon={<Inbox size={32} />} title="검색 결과가 없습니다" />,
}

/** Table 행 클릭으로 Modal 상세를 여는 목록-상세 패턴. */
export const 목록상세: Story = {
  render: () => {
    const [selected, setSelected] = useState<AssetRow | null>(null)

    return (
      <>
        <Table<AssetRow>
          columns={[
            { key: 'name', header: '자산명', render: (row) => row.name },
            { key: 'category', header: '종류', render: (row) => <Badge variant="brand">{row.category}</Badge> },
          ]}
          rows={allRows}
          getRowId={(row) => row.id}
          onRowClick={(row) => setSelected(row)}
        />
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
          <p className="text-sm text-[var(--ds-text)]">종류: {selected?.category}</p>
        </Modal>
      </>
    )
  },
}
