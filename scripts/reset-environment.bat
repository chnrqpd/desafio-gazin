@echo off
echo Zerando ambiente Docker...
docker-compose down -v
docker volume prune -f
docker image prune -a -f

echo Subindo ambiente do zero...
docker-compose up --build -d

echo Aguardando containers subirem...
timeout /t 30 /nobreak

echo Executando migrations...
docker-compose exec backend npm run db:migrate

echo Executando seeds...
docker-compose exec backend npm run db:seed

echo Ambiente resetado!
echo Frontend: http://localhost:3001
echo Backend API: http://localhost:3000
echo Swagger: http://localhost:3000/api-docs
pause