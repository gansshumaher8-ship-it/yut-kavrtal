import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { getSiteSettings, writeSiteSettings } from '@/lib/site-settings';
import type { SiteSettings } from '@/types/site-settings';

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json(settings, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('GET /api/settings/site error', error);
    return NextResponse.json({ message: 'Ошибка загрузки' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }
  if ((session as any).role !== 'admin') {
    return NextResponse.json({ message: 'Только администратор может менять настройки сайта' }, { status: 403 });
  }
  try {
    const body = (await request.json()) as Partial<SiteSettings>;
    const current = await getSiteSettings();
    const updated: SiteSettings = {
      name: body.name ?? current.name,
      inn: body.inn ?? current.inn,
      kpp: body.kpp ?? current.kpp,
      ogrn: body.ogrn ?? current.ogrn,
      address: body.address ?? current.address,
      phone: body.phone ?? current.phone,
      email: body.email ?? current.email,
      bankName: body.bankName ?? current.bankName,
      bik: body.bik ?? current.bik,
      bankAccount: body.bankAccount ?? current.bankAccount,
      corrAccount: body.corrAccount ?? current.corrAccount,
      aboutShort: body.aboutShort ?? current.aboutShort,
      aboutPageContent: body.aboutPageContent ?? current.aboutPageContent,
      footerDisclaimer: body.footerDisclaimer ?? current.footerDisclaimer,
      policyUrl: body.policyUrl ?? current.policyUrl,
      offerUrl: body.offerUrl ?? current.offerUrl,
      trustObjects: body.trustObjects ?? current.trustObjects,
      trustYears: body.trustYears ?? current.trustYears,
      trustAmount: body.trustAmount ?? current.trustAmount,
      howWeWorkSteps: body.howWeWorkSteps ?? current.howWeWorkSteps,
      faqContent: body.faqContent ?? current.faqContent,
      caseStudies: body.caseStudies ?? current.caseStudies,
      reviewsContent: body.reviewsContent ?? current.reviewsContent,
      cookieConsentText: body.cookieConsentText ?? current.cookieConsentText,
      yandexMetrikaId: body.yandexMetrikaId ?? current.yandexMetrikaId
    };
    await writeSiteSettings(updated);
    return NextResponse.json(updated, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('PUT /api/settings/site error', error);
    return NextResponse.json({ message: 'Ошибка сохранения' }, { status: 500 });
  }
}
