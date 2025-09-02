### Doc para a rota /app (arquivo Index.jsx):
- Components estao em /components/inicio;
- todos os componentes recebem os dados passados por props;
- existe 4 consts que precisam receber os dados da api sendo elas (user, treinosDados, metrics, recentActivities) são atualizadas usando o set dentro do useEffect;
- existe uma func que atualiza os objetivos, então precisa fazar req para api (atualizarMetricas);