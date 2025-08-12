import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from '@/integrations/supabase/client'

export default function PatientForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    nome_completo: '',
    data_nascimento: '',
    genero: '',
    cpf: '',
    rg: '',
    nome_mae: '',
    nome_pai: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    telefone: '',
    celular: '',
    email: '',
    observacoes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('pacientes')
        .insert([formData])
        .select()

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Paciente cadastrado com sucesso.",
      })

      // Limpar formulário
      setFormData({
        nome_completo: '',
        data_nascimento: '',
        genero: '',
        cpf: '',
        rg: '',
        nome_mae: '',
        nome_pai: '',
        endereco: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        telefone: '',
        celular: '',
        email: '',
        observacoes: ''
      })

    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar paciente: " + error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Cadastro de Paciente</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Dados Pessoais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome_completo">Nome Completo *</Label>
                <Input
                  id="nome_completo"
                  name="nome_completo"
                  value={formData.nome_completo}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="data_nascimento">Data de Nascimento *</Label>
                <Input
                  id="data_nascimento"
                  name="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="genero">Gênero</Label>
                <Input
                  id="genero"
                  name="genero"
                  value={formData.genero}
                  onChange={handleChange}
                  placeholder="Masculino, Feminino, Outro"
                />
              </div>
              
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="000.000.000-00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  name="rg"
                  value={formData.rg}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="nome_mae">Nome da Mãe</Label>
                <Input
                  id="nome_mae"
                  name="nome_mae"
                  value={formData.nome_mae}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="nome_pai">Nome do Pai</Label>
                <Input
                  id="nome_pai"
                  name="nome_pai"
                  value={formData.nome_pai}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Endereço</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  placeholder="Rua, Avenida, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="numero">Número</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Apt, Casa, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  placeholder="SP, RJ, MG, etc."
                />
              </div>
              
              <div>
                <Label htmlFor="cep">CEP</Label>
                <Input
                  id="cep"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Contato</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 1234-5678"
                />
              </div>
              
              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="paciente@email.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm border">
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Observações</h2>
            
            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                placeholder="Informações adicionais sobre o paciente..."
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setFormData({
                nome_completo: '',
                data_nascimento: '',
                genero: '',
                cpf: '',
                rg: '',
                nome_mae: '',
                nome_pai: '',
                endereco: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
                telefone: '',
                celular: '',
                email: '',
                observacoes: ''
              })}
            >
              Limpar
            </Button>
            <Button type="submit">
              Cadastrar Paciente
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}