## AdonisJs Boilerplate/First project

## Sobre
- Boilerplate dashboard com adonisjs com auth básico, template e banco
- Uma versão melhorada(com o tema) do meu outro projeto https://github.com/tsalesproductions/adonisjs-first

## Requisitos
- Ter o NodeJs instalado
- Ter um servidor MYSQL para testar

## Como usar?
- Clone o repositório
- Rode o comando `npm install` ou `npm i `
- Edite o arquivo `.env` e troque os dados do seu banco de dados
- Rode o comando `node ace migration:run` para importar o banco
- Após, rode o comando `node ace serve --watch` para ligar o servidor

#### .env
Dados a serem alterados
```text
    DB_CONNECTION=mysql
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASSWORD=
    MYSQL_DB_NAME=teste
```


## Algumas anotações

Algumas anotações importantes que achei interessante guardar para decorar

```text
-- startar servidor: node ace serve --watch

-- Criar controle: node ace make:controller NomeController -r´

-- Criar controle de autenticação: node ace make:controller AuthController -r´
-- npm i @adonisjs/auth
-- https://docs.adonisjs.com/guides/security/web-security#csrf-protection
-- https://docs.adonisjs.com/guides/security/web-security
-- Configurar bcrypt: https://github.com/BassoliCodes/helpdesk/blob/main/config/hash.ts
-- Bcrypt: npm i phc-bcrypt
-- hash bcrypt rounds: 12

-- Banco: https://docs.adonisjs.com/guides/database/introduction
node ace make:model user
node ace make:migration users
-- Adicionar variaveis em env e env.ts
-- importar o banco: node ace migration:run


-- Bloquear rotas grupo middleware
-- start/kernel.ts e registrar -> auth: () => import('App/Middleware/Auth'),
```

## License

SEI LÁ, NÃO ENTENDO MUITO DE LICENÇA

**Faça um bom uso!!**
