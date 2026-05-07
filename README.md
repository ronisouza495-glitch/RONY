# Central de Jogos - PWA Profissional

Plataforma completa para gerenciamento de links oficiais de jogos, desenvolvida com **React**, **Firebase** e **Tailwind CSS**.

## 🚀 Tecnologias
- **React 18** (Vite)
- **Firebase Auth** (Google Login)
- **Cloud Firestore** (Banco de dados em tempo real)
- **Tailwind CSS** (Design responsivo e moderno)
- **Motion** (Animações fluidas)
- **PWA** (Instalável no celular/computador)

## ⚙️ Configuração do Firebase

Para que o projeto funcione corretamente, siga estes passos:

1. Acesse o [Console do Firebase](https://console.firebase.google.com/).
2. Crie um novo projeto.
3. No menu lateral, vá em **Autenticação** > **Settings** > **Authorized Domains** e adicione o domínio onde o app será hospedado (ex: `central-jogos.vercel.app`).
4. Ative o método de login **Google** em **Authentication** > **Sign-in method**.
5. Crie um banco de dados **Firestore** no modo produção e use as regras fornecidas no arquivo `firestore.rules` deste repositório.
6. Adicione um App Web ao seu projeto Firebase e copie as credenciais.
7. Substitua o conteúdo do arquivo `firebase-applet-config.json` pelas suas credenciais.
8. **Ative o Firebase Storage:** No console do Firebase, acesse **Storage** e clique em **Get Started**. Escolha o modo de produção e a região.
9. **Configure as Regras do Storage:** Use as regras abaixo para permitir que apenas você (admin) faça upload de arquivos IPA:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /ipas/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'ronisouza495@gmail.com';
    }
  }
}
```

### 🛡️ Definindo o Administrador
No arquivo `firestore.rules`, localize a linha:
`request.auth.token.email == 'ronisouza495@gmail.com'`
Substitua pelo seu email para ter acesso ao painel admin.

## 📦 Publicação na Vercel

1. Crie uma conta na [Vercel](https://vercel.com/).
2. Conecte seu repositório GitHub.
3. Configure o comando de build como `npm run build` e o diretório de saída como `dist`.
4. Adicione as variáveis de ambiente necessárias (se houver).
5. Clique em **Deploy**.

## 📱 Recursos PWA
O site já possui manifesto e service worker. Para instalar:
- **Android/Chrome:** Clique no botão "Instalar App" no banner inicial ou no menu do navegador.
- **iOS/Safari:** Clique em Compartilhar > Adicionar à Tela de Início.

## 📝 Notas
- Este projeto foca em links oficiais e agora oferece suporte a upload de arquivos IPA para instalação manual via ferramentas como GBox.
- O administrador deve carregar os arquivos IPA via painel admin ou fornecer links de fontes confiáveis.
