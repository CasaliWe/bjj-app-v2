import React from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";

/**
 * Componente de formulário de pesquisa de usuários
 * @param {Object} props - Propriedades do componente
 * @param {string} props.searchQuery - Termo de pesquisa
 * @param {string} props.searchBy - Tipo de pesquisa ('nome' ou 'bjj_id')
 * @param {function} props.onSearchChange - Função chamada ao alterar o termo de pesquisa
 * @param {function} props.onSearchByChange - Função chamada ao alterar o tipo de pesquisa
 * @param {function} props.onSubmit - Função chamada ao enviar o formulário
 * @param {boolean} props.isSearching - Indica se está pesquisando
 * @returns {JSX.Element} Componente React
 */
const SearchForm = ({
  searchQuery,
  searchBy,
  onSearchChange,
  onSearchByChange,
  onSubmit,
  isSearching
}) => {
  // Manipula a mudança do tipo de pesquisa (com adaptação para o Select do Shadcn/ui)
  const handleSearchByChange = (value) => {
    // Cria um objeto de evento simulado para manter a compatibilidade com o hook
    const event = { target: { value } };
    onSearchByChange(event);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Pesquisa de Usuários</CardTitle>
        <CardDescription>
          Encontre outros praticantes de Jiu-Jitsu pela plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Select 
                defaultValue={searchBy} 
                onValueChange={handleSearchByChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pesquisar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="bjj_id">BJJ ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3 flex gap-2">
              <Input
                type="text"
                placeholder={searchBy === 'nome' ? "Digite o nome do usuário..." : "Digite o BJJ ID..."}
                value={searchQuery}
                onChange={onSearchChange}
                className="flex-1"
              />
              
              <Button 
                type="submit" 
                disabled={isSearching}
                className="bg-bjj-gold hover:bg-bjj-gold/90 text-black"
              >
                {isSearching ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchForm;