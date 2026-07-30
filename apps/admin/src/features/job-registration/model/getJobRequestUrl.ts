import type { JobRegistrationReqType } from './schema';

export const getJobRequestUrl = (
  path: string,
  body: JobRegistrationReqType,
  retainedAttachmentIds?: number[],
) => {
  const searchParams = new URLSearchParams({
    companyName: body.companyName,
    description: body.description,
    employmentType: body.employmentType,
    recruitStart: body.recruitStart,
    recruitEnd: body.recruitEnd,
  });

  body.positionNames.forEach((positionName) => searchParams.append('positionNames', positionName));
  if (retainedAttachmentIds) {
    if (retainedAttachmentIds.length === 0) {
      searchParams.append('retainedAttachmentIds', '');
    }
    retainedAttachmentIds.forEach((attachmentId) =>
      searchParams.append('retainedAttachmentIds', String(attachmentId)),
    );
  }

  return `${path}?${searchParams}`;
};
