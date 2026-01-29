# 게시판

게시판 CRUD 및 차트 데이터 시각화 웹 애플리케이션

---

## 프로젝트 실행 방법

### 환경 변수 설정

`.env` 파일을 프로젝트 루트에 생성 후 API 베이스 URL 설정

```env
VITE_API_BASE_URL=https://your-api-base-url.com
```

### 설치 및 실행

1. **의존성 설치**

```bash
npm install
```

2. **개발 서버 실행**

```bash
npm run dev
```

3. **프로덕션 빌드**

```bash
npm run build
```

4. **프로덕션 빌드 미리보기**

```bash
npm run preview
```

---

## 사용한 기술 스택

| 구분                | 기술                                        |
| ------------------- | ------------------------------------------- |
| **Core**            | React 19, TypeScript 5.9, Vite 7            |
| **서버 상태**       | TanStack Query (React Query)                |
| **클라이언트 상태** | Zustand                                     |
| **라우팅**          | React Router 7                              |
| **스타일**          | Tailwind CSS 4                              |
| **폼/검증**         | React Hook Form, Zod, @hookform/resolvers   |
| **HTTP**            | Axios                                       |
| **차트**            | D3.js                                       |
| **기타**            | react-icons, @lukemorales/query-key-factory |

---

## 주요 구현 기능 요약

### 1. 로그인 및 인증

- 이메일/비밀번호 로그인, Zod 스키마 검증
- 로그인 성공 시 토큰 저장 (Zustand persist), API 요청 시 Bearer 토큰 자동 첨부
- 비인증 시 로그인 페이지로 리다이렉트 (AuthGuard)

**로그인 훅 (폼 검증 + 제출)**

```ts
const useLogin = () => {
    const navigate = useNavigate()
    const { mutateAsync, isPending } = useLoginMutation()
    const { setToken } = useCommonAction()

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors, isValid },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: { email: '', password: '' },
    })

    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            const res = await mutateAsync(data)
            setToken(res.token)
            navigate(ROUTER_PATH.POSTS)
        } catch (error) {
          // 에러 예외처리
        }
    }
    return { register, handleSubmit: handleFormSubmit(onSubmit), errors, isFormValid, ... }
}
```

**인증 가드 (라우터)**

```ts
const AuthGuard = () => {
    const token = useCommonStore((state) => state.token)
    const hydrated = useCommonStore.persist.hasHydrated()
    if (!hydrated) return null
    if (!token) return <Navigate to={ROUTER_PATH.LOGIN} replace />
    return (
        <SideMenuLayout>
            <Outlet />
        </SideMenuLayout>
    )
}
```

---

### 2. 게시판 (목록 / 필터 / CRUD)

**게시글 목록 무한 스크롤 쿼리**

```ts
// src/entities/post/query/post.query.ts
export const usePostListInfiniteQuery = (
  params: Omit<IPostListRequest, "prevCursor" | "nextCursor">,
) => {
  return useSuspenseInfiniteQuery({
    queryKey: postQueryKeys.list(params).queryKey,
    queryFn: ({ pageParam }) =>
      postApi.getPostList({
        ...params,
        ...(pageParam && { nextCursor: pageParam }),
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};
```

**금칙어 처리 (Zod 스키마)**

```ts
// src/shared/constants/post.constants.ts
export const FORBIDDEN_WORDS = [
  "캄보디아",
  "프놈펜",
  "불법체류",
  "텔레그램",
] as const;

// src/features/post/model/post.type.ts
export const postFormSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(80, "제목은 80자 이하여야 합니다"),
  body: z
    .string()
    .min(1, "본문을 입력해주세요")
    .max(2000, "본문은 2000자 이하여야 합니다")
    .refine((value) => !FORBIDDEN_WORDS.some((word) => value.includes(word)), {
      message: "금칙어가 포함되어 있어 등록할 수 없습니다.",
    }),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  tags: z.array(z.string().max(24)).max(5),
});
```

---

### 3. 차트 데이터 시각화

- **차트 종류**: Bar, Donut, MultiLine, StackedArea, StackedBar (D3.js)
- **데이터**: 전역 쿼리 키(`chartQueryKeys`)로 쿼리 배열을 묶고 `useSuspenseQueries`로 일괄 조회, `Suspense` + `ChartLoadingFallback`으로 로딩 처리
- **범례**: `useChartLegend` 훅으로 범례 상태(색상/표시 여부) 공통 관리

**전역 쿼리 키 + useSuspenseQueries + Fallback**

차트용 쿼리 키를 한 곳에서 관리하고, `allChartsQueries` 배열로 묶어 `useSuspenseQueries`로 한 번에 조회합니다. 차트 페이지에서는 `Suspense`로 감싸 `ChartLoadingFallback`을 보여줍니다.

```ts
// src/entities/chart/model/chart.queryKey.ts
export const chartQueryKeys = createQueryKeys("chart", {
  weeklyMoodTrend: () => ["weekly-mood-trend"],
  weeklyWorkoutTrend: () => ["weekly-workout-trend"],
  popularSnackBrands: () => ["popular-snack-brands"],
  topCoffeeBrands: () => ["top-coffee-brands"],
  coffeeConsumption: () => ["coffee-consumption"],
  snackImpact: () => ["snack-impact"],
});

// src/entities/chart/query/chart.query.ts
const allChartsQueries = [
  {
    queryKey: chartQueryKeys.weeklyMoodTrend().queryKey,
    queryFn: () => chartApi.getMockWeeklyMoodTrend(),
  },
  {
    queryKey: chartQueryKeys.popularSnackBrands().queryKey,
    queryFn: () => chartApi.getMockPopularSnackBrands(),
  },
  {
    queryKey: chartQueryKeys.topCoffeeBrands().queryKey,
    queryFn: () => chartApi.getMockTopCoffeeBrands(),
  },
  {
    queryKey: chartQueryKeys.weeklyWorkoutTrend().queryKey,
    queryFn: () => chartApi.getMockWeeklyWorkoutTrend(),
  },
  {
    queryKey: chartQueryKeys.coffeeConsumption().queryKey,
    queryFn: () => chartApi.getMockCoffeeConsumption(),
  },
  {
    queryKey: chartQueryKeys.snackImpact().queryKey,
    queryFn: () => chartApi.getMockSnackImpact(),
  },
] as const;

export const useAllChartsSuspenseQuery = () => {
  const results = useSuspenseQueries({ queries: allChartsQueries });
  const data = {
    weeklyMoodTrend: results[0].data,
    popularSnackBrands: results[1].data,
    topCoffeeBrands: results[2].data,
    weeklyWorkoutTrend: results[3].data,
    coffeeConsumption: results[4].data,
    snackImpact: results[5].data,
  };
  return { data };
};
```

```ts
// src/pages/chart/ChartPage.tsx
const ChartsPage = () => (
    <Suspense fallback={<ChartLoadingFallback />}>
        <ChartList />
    </Suspense>
)

// ChartList 내부에서
const { data } = useAllChartsSuspenseQuery()
const { weeklyMoodTrend, popularSnackBrands, ... } = data
```

**범례 공통 훅 (useChartLegend)**

```ts
const { legendItems, visibleKeys, handleColorChange, handleVisibilityChange } =
  useChartLegend({
    items: series.map((s) => ({ id: s.key, label: s.label })),
  });
const activeSeries = series.filter((s) => visibleKeys.includes(s.key));
```

---

## (선택) 프로젝트 구조

**Feature-Sliced Design (FSD) 스타일**

```
src/
├── app/              # 앱 초기화, 라우터, 프로바이더
├── pages/            # 라우트별 페이지 (Login, Posts, Chart)
├── features/         # 기능 단위 (login, post, chart)
│   ├── hooks/        # useLogin, usePostForm, useChartLegend 등
│   ├── model/        # 폼/필터 타입 등
│   └── ui/           # 폼, 테이블, 차트, 범례 등
├── entities/         # 도메인 엔티티 (post, chart, login)
│   ├── api/          # API 호출
│   ├── model/        # 타입, 쿼리 키
│   └── query/        # TanStack Query 훅
└── shared/           # 공용 (api base, 상수, 레이아웃, 모달 스토어, AuthGuard 등)
```

---
