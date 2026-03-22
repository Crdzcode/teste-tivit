import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/api/auth';
import { createSession } from '@/lib/utils';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const authResponse = await loginUser({ username, password });
    await createSession({
      token: authResponse.token,
      role: authResponse.role as 'user' | 'admin',
    });

    const redirectUrl = authResponse.role === 'admin' ? '/admin' : '/user';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error: any) {
    let errorMsg = 'Erro desconhecido ao fazer login';
    if (error && typeof error === 'object' && typeof error.message === 'string') {
      if (error.message.startsWith('Login failed:')) {
        // Erro de autenticação vindo da API, pode conter mensagem customizada
        // Exemplo: "Login failed: 401 Unauthorized - Detalhe da API"
        const match = error.message.match(/Login failed: (\d+) ([^-]+)(?: - (.*))?/);
        if (match) {
          const [, code, status, apiMsg] = match;
          if (apiMsg) {
            errorMsg = apiMsg;
          } else if (code === '401') {
            errorMsg = 'Usuário ou senha inválidos.';
          } else {
            errorMsg = `Erro ao autenticar (${status.trim()})`;
          }
        } else {
          errorMsg = error.message;
        }
      } else if (error.message === 'Token not received from API') {
        errorMsg = 'A API não retornou o token de autenticação.';
      } else {
        errorMsg = error.message;
      }
    }
    const url = new URL('/login', request.url);
    url.searchParams.set('error', errorMsg);
    return NextResponse.redirect(url);
  }
}
