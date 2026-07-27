import Link from 'next/link';

import { BrandLogo, Button } from '@chup/ui';

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <BrandLogo imageSrc="/chup-logo.png" name="CHUP" />
      <div className="text-center">
        <h1 className="text-2xl font-bold">페이지를 찾을 수 없어요</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          요청하신 페이지가 존재하지 않거나 이동되었어요.
        </p>
      </div>
      <Button size="lg" className="w-full max-w-xs" nativeButton={false} render={<Link href="/" />}>
        홈으로 돌아가기
      </Button>
    </div>
  );
};

export default NotFound;
