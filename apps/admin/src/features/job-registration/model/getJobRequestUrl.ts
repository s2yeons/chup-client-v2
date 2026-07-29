import type { JobRegistrationReqType } from './schema';

export const getJobRequestUrl = (path: string, body: JobRegistrationReqType) => {
  const searchParams = new URLSearchParams({
    companyName: body.companyName,
    description: body.description,
    employmentType: body.employmentType,
    recruitStart: body.recruitStart,
    recruitEnd: body.recruitEnd,
  });

  body.positionNames.forEach((positionName) => searchParams.append('positionNames', positionName));

  return `${path}?${searchParams}`;
};
