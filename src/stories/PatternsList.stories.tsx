import { useState } from 'react'
import { Plus } from 'lucide-react'
import type { UIEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '../components/Button'
import { EmptyState } from '../components/EmptyState'
import { Table } from '../components/Table'
import { Badge } from '../components/Badge'
import { Modal } from '../components/Modal'
import { Pagination } from '../components/Pagination'
import { Card } from '../components/Card'
import { SortableList } from '../components/SortableList'
import { InstantSearchBar } from './SearchBars'

const meta: Meta = {
  title: '패턴/목록',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

interface ItemRow {
  id: string
  name: string
  category: string
}

const allRows: ItemRow[] = [
  { id: '1', name: '시스템 점검 안내', category: '공지' },
  { id: '2', name: '커뮤니티 이벤트', category: '이벤트' },
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
 * 목록페이징 위에 검색 영역까지 얹은 완전한 목록 패턴: 검색바(패턴/검색의 즉시검색을 그대로
 * 불러와 씀) + 그리드 + (총 건수·페이지네이션). 검색바와 그리드는 붙여서 하나의 덩어리로 보이게
 * 하고, 총 건수는 페이지네이션과 같은 줄 좌측에 둔다. 검색 결과가 없어도 그리드 자체는 그대로
 * 두고(헤더 유지) Table의 emptyMessage 자리에 EmptyState(variant="search")만 넣는다 — 총 건수·
 * 페이지네이션 줄만 숨긴다.
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
        <InstantSearchBar
          keyword={query}
          onKeywordChange={(value) => {
            setQuery(value)
            setPage(1)
          }}
          keywordPlaceholder="이름으로 검색..."
        />
        <Table<UserRow> columns={userColumns} rows={pageRows} getRowId={(row) => row.id} emptyMessage={<EmptyState variant="search" />} />
        {filtered.length > 0 && (
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

/**
 * 목록스크롤 위에 검색 영역까지 얹은 패턴: 검색바(패턴/검색의 즉시검색을 그대로 불러와 씀) +
 * 스크롤 그리드 + 총 건수. 결과가 없어도 그리드는 그대로 두고 emptyMessage만 EmptyState(variant="search")로 바꾼다.
 */
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
        <InstantSearchBar
          keyword={query}
          onKeywordChange={(value) => {
            setQuery(value)
            setVisibleCount(SCROLL_PAGE_SIZE)
          }}
          keywordPlaceholder="이름으로 검색..."
        />
        <Table<UserRow>
          columns={userColumns}
          rows={rows}
          getRowId={(row) => row.id}
          stickyHeader
          maxHeightClass="max-h-80"
          onScroll={handleScroll}
          emptyMessage={<EmptyState variant="search" />}
        />
        {filtered.length > 0 && (
          <span className="text-xs text-[var(--ds-text-subtle)]">총 {filtered.length.toLocaleString()}건</span>
        )}
      </div>
    )
  },
}

/**
 * 그리드가 비어있는 빈 상태: 그리드 헤더는 그대로 두고 본문 자리(Table의 emptyMessage)에
 * EmptyState만 불러와 넣는다 — 검색 결과가 없는 경우(variant="search")든 데이터 자체가
 * 없는 경우(variant="data")든 배치는 완전히 같고 EmptyState의 variant만 다르다. 위 토글로
 * variant를 바꿔가며 확인한다. 검색바 자체는 패턴/검색에서 다루므로 여기서는 다루지 않는다.
 */
export const 빈내용: Story = {
  render: () => {
    const [variant, setVariant] = useState<'search' | 'data'>('data')

    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Button size="sm" variant={variant === 'data' ? 'primary' : 'secondary'} onClick={() => setVariant('data')}>
            데이터 없음
          </Button>
          <Button size="sm" variant={variant === 'search' ? 'primary' : 'secondary'} onClick={() => setVariant('search')}>
            검색 결과 없음
          </Button>
        </div>
        <Table<UserRow> columns={userColumns} rows={[]} getRowId={(row) => row.id} emptyMessage={<EmptyState variant={variant} />} />
      </div>
    )
  },
}

/** Table 행 클릭으로 Modal 상세를 여는 목록-상세 패턴. */
export const 목록상세: Story = {
  render: () => {
    const [selected, setSelected] = useState<ItemRow | null>(null)

    return (
      <>
        <Table<ItemRow>
          columns={[
            { key: 'name', header: '이름', render: (row) => row.name },
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

interface OrderedRow {
  id: string
  name: string
  summary: string
  category: string
}

const orderedRows: OrderedRow[] = [
  { id: '1', name: '시스템 점검 안내', summary: '정기 점검으로 일부 기능 이용이 제한됩니다.', category: '공지' },
  { id: '2', name: '이용약관 개정 안내', summary: '개정된 약관은 다음 달 1일부터 적용됩니다.', category: '공지' },
  { id: '3', name: '커뮤니티 이벤트', summary: '참여자 중 추첨을 통해 기념품을 드립니다.', category: '이벤트' },
  { id: '4', name: '신규 기능 소개', summary: '목록 순서를 드래그로 바꿀 수 있습니다.', category: '안내' },
]

/**
 * 순서가 의미 있는 목록(메뉴 순서, 챕터 순서 등)을 드래그로 재정렬하는 패턴: Card(제목+건수, 추가 버튼) 안에
 * SortableList. 드롭 즉시 화면 순서를 먼저 바꾸고(낙관적 갱신) 저장을 요청하며, 저장 중에는 disabled로 추가
 * 이동을 막는다. 저장이 실패하면 이전 순서로 되돌린다 — 아래 스위치로 실패를 흉내 낼 수 있다.
 * 행 본문(이름)은 링크/버튼이어도 되고, 드래그는 왼쪽 손잡이로만 시작된다.
 */
export const 목록순서변경: Story = {
  render: () => {
    const [rows, setRows] = useState(orderedRows)
    const [saving, setSaving] = useState(false)
    const [failSave, setFailSave] = useState(false)

    function handleReorder(next: OrderedRow[]) {
      const prev = rows
      setRows(next)
      setSaving(true)
      // 실제로는 여기서 새 순서(id 목록)를 서버에 저장한다
      setTimeout(() => {
        if (failSave) setRows(prev)
        setSaving(false)
      }, 600)
    }

    return (
      <div className="flex max-w-lg flex-col gap-3">
        <div className="flex gap-2">
          <Button size="sm" variant={failSave ? 'secondary' : 'primary'} onClick={() => setFailSave(false)}>
            저장 성공
          </Button>
          <Button size="sm" variant={failSave ? 'primary' : 'secondary'} onClick={() => setFailSave(true)}>
            저장 실패
          </Button>
        </div>
        <Card
          title={
            <>
              공지사항 <span className="font-normal text-[var(--ds-text-subtlest)]">{rows.length}</span>
            </>
          }
          actions={
            <Button variant="secondary" size="sm" icon={<Plus size={12} />}>
              추가
            </Button>
          }
        >
          {rows.length === 0 ? (
            <EmptyState variant="data" />
          ) : (
            <SortableList
              items={rows}
              getId={(row) => row.id}
              onReorder={handleReorder}
              disabled={saving}
              renderItem={(row) => (
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--ds-text)]">{row.name}</span>
                    <Badge variant="neutral">{row.category}</Badge>
                  </div>
                  <p className="line-clamp-2 text-xs text-[var(--ds-text-subtle)]">{row.summary}</p>
                </div>
              )}
            />
          )}
        </Card>
      </div>
    )
  },
}
