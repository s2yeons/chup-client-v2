# 관리자 공고 첨부파일 관리 설계

## 목표

공고 수정 폼에서 기존 첨부파일을 표시하고, 유지·삭제·새 파일 추가를 한 번의 수정 요청으로 반영한다.

## 범위

- 기존 첨부파일의 파일명 목록과 삭제 버튼을 수정 폼에 표시한다.
- 기존 파일 수와 새 파일 수의 합을 최대 5개로 제한한다.
- 저장 시 남아 있는 기존 파일 ID를 `retainedAttachmentIds`로, 새 파일을 multipart `attachments`로 보낸다.

기존 파일 다운로드, 즉시 삭제 API, 공고 등록 흐름 변경은 포함하지 않는다.

## 데이터 흐름

1. `useGetAdminJob`의 `attachments: { id, fileName }[]`를 기존 파일 목록으로 표시한다.
2. 사용자가 기존 파일을 삭제하면 해당 ID를 화면 상태에서 제거한다.
3. 사용자가 새 파일을 고르면 기존 목록과 합쳐 최대 5개까지만 선택한다.
4. 저장 시 기존 목록의 ID를 query parameter `retainedAttachmentIds`로 반복 전달하고, 새 파일을 `FormData`의 `attachments`로 전달한다.
5. 서버는 유지 ID에 없는 기존 파일을 삭제하고 새 파일을 추가한다.

## 구현 경계

- `entities/dashboard`: 기존 상세 응답의 첨부파일 타입과 URL 생성만 담당한다.
- `features/job-registration`: 기존·신규 첨부파일 상태와 PATCH 요청 조합을 담당한다.
- `ui/JobRegistrationForm`: 목록 표시, 삭제 버튼, 5개 제한을 담당한다.

## 오류 처리와 검증

- 파일 총합이 5개면 파일 선택을 비활성화한다.
- 한 번에 남은 자리보다 많은 파일을 선택하면 가능한 수만 반영한다.
- 서버의 413 응답은 기존 공통 서버 검증 오류 처리로 표시한다.
- 회귀 검증은 유지·삭제·추가 조합이 `retainedAttachmentIds`와 `attachments`로 직렬화되는지 확인한다.
