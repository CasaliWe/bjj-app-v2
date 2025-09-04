### Doc para o exp:
- O component faz tudo e nele tem uma func q precisa de atenção (enviarExpParaAPI);
- para importar e passar o exp é assim:
    import Exp, { useExp } from "@/components/exp/Exp";
    const { mostrarExp } = useExp();
    mostrarExp(150, "Você ganhou 150 exp por adicionar uma nova técnica!");

    {/* Modal de upgrade para o plano Plus */}
    <UpgradeModal />
    {/* Modal de upgrade para o plano Plus */}
