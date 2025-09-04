### Doc para cadastro de user:
- tem o cloud flare para evitar criação via bot;
- tem uma func que precisa de atenção;
- envia para api, retorna o token, manda para /app;
- na /app como é o primeiro acesso mostra o modal de aprensentação;
- o modal só sai quando ver tudo e nele tem uma func q faz req para confimar que o user viu tudo o tutorial;