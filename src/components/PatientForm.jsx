import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Camera, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Upload,
  X,
  Save,
  ArrowLeft,
  Calendar as CalendarIcon,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import InputMask from 'react-input-mask';

// Validação de CPF
const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
  const cpfDigits = cpf.split('').map(el => +el);
  const rest = (count) => {
    return (cpfDigits.slice(0, count-1)
      .reduce((soma, el, index) => (soma + el * (count-index)), 0) * 10) % 11 % 10;
  };
  
  return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
};

// Schema de validação
const patientSchema = z.object({
  // Dados pessoais
  photo: z.any().optional(),
  name: z.string().min(2, 'Nome é obrigatório'),
  socialName: z.string().optional(),
  cpf: z.string().refine(validateCPF, 'CPF inválido'),
  rg: z.string().optional(),
  otherDocType: z.string().optional(),
  otherDocNumber: z.string().optional(),
  gender: z.enum(['masculino', 'feminino', 'outro']),
  birthDate: z.date(),
  ethnicity: z.string().optional(),
  race: z.string().optional(),
  birthPlace: z.string().optional(),
  nationality: z.string().optional(),
  profession: z.string().optional(),
  maritalStatus: z.string().optional(),
  motherName: z.string().optional(),
  motherProfession: z.string().optional(),
  fatherName: z.string().optional(),
  fatherProfession: z.string().optional(),
  guardianName: z.string().optional(),
  guardianCpf: z.string().optional(),
  spouseName: z.string().optional(),
  isNewbornInPlan: z.boolean().default(false),
  legacyCode: z.string().optional(),
  
  // Observações e anexos
  observations: z.string().optional(),
  attachments: z.array(z.any()).default([]),
  
  // Contato
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  cellphone: z.string().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  
  // Endereço
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  reference: z.string().optional(),
});

const PatientForm = () => {
  const [photoPreview, setPhotoPreview] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    personalData: true,
    observations: false,
    contact: true,
    address: true,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      isNewbornInPlan: false,
      attachments: [],
      gender: 'masculino',
    },
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result);
      };
      reader.readAsDataURL(file);
      setValue('photo', file);
    }
  };

  const handleAttachmentUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    setValue('attachments', [...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    const newAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(newAttachments);
    setValue('attachments', newAttachments);
  };

  const searchCEP = async (cep) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setValue('street', data.logradouro);
        setValue('neighborhood', data.bairro);
        setValue('city', data.localidade);
        setValue('state', data.uf);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const onSubmit = (data) => {
    console.log('Dados do paciente:', data);
    // Aqui você implementaria a lógica de salvamento
  };

  const watchedCep = watch('cep');
  React.useEffect(() => {
    if (watchedCep && watchedCep.length === 9) {
      searchCEP(watchedCep.replace('-', ''));
    }
  }, [watchedCep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-blue-light to-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-medical-blue to-primary rounded-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            Cadastro de Paciente
          </h1>
          <p className="text-medical-gray mt-2">Preencha os dados do paciente com atenção</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dados Pessoais */}
          <Card className="shadow-card border-border/50">
            <Collapsible open={expandedSections.personalData} onOpenChange={() => toggleSection('personalData')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-medical-blue" />
                      Dados Pessoais
                    </div>
                    {expandedSections.personalData ? <ChevronUp /> : <ChevronDown />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Upload de Foto */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {photoPreview ? (
                        <div className="relative">
                          <img 
                            src={photoPreview} 
                            alt="Preview" 
                            className="w-32 h-32 rounded-full object-cover border-4 border-medical-blue/20"
                          />
                          <Button 
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => setPhotoPreview(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                          <Camera className="h-8 w-8 text-medical-gray" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Label htmlFor="photo-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Carregar Foto
                          </span>
                        </Button>
                      </Label>
                    </div>
                  </div>

                  <Separator />

                  {/* Nome e Nome Social */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        {...register('name')}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socialName">Nome Social</Label>
                      <Input id="socialName" {...register('socialName')} />
                    </div>
                  </div>

                  {/* CPF e RG */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <InputMask
                        mask="999.999.999-99"
                        {...register('cpf')}
                      >
                        {(inputProps) => (
                          <Input
                            {...inputProps}
                            id="cpf"
                            className={errors.cpf ? 'border-destructive' : ''}
                          />
                        )}
                      </InputMask>
                      {errors.cpf && <p className="text-sm text-destructive">{errors.cpf.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG</Label>
                      <Input id="rg" {...register('rg')} />
                    </div>
                  </div>

                  {/* Outros Documentos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Outros Documentos</Label>
                      <Select onValueChange={(value) => setValue('otherDocType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cnh">CNH</SelectItem>
                          <SelectItem value="passaporte">Passaporte</SelectItem>
                          <SelectItem value="carteira_trabalho">Carteira de Trabalho</SelectItem>
                          <SelectItem value="titulo_eleitor">Título de Eleitor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherDocNumber">Número do Documento</Label>
                      <Input id="otherDocNumber" {...register('otherDocNumber')} />
                    </div>
                  </div>

                  {/* Sexo */}
                  <div className="space-y-3">
                    <Label>Sexo *</Label>
                    <RadioGroup 
                      onValueChange={(value) => setValue('gender', value)}
                      className="flex space-x-6"
                      defaultValue="masculino"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="masculino" id="masculino" />
                        <Label htmlFor="masculino">Masculino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="feminino" id="feminino" />
                        <Label htmlFor="feminino">Feminino</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="outro" id="outro" />
                        <Label htmlFor="outro">Outro</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Data de Nascimento */}
                  <div className="space-y-2">
                    <Label>Data de Nascimento *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watch('birthDate') && "text-muted-foreground",
                            errors.birthDate && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watch('birthDate') ? format(watch('birthDate'), "PPP", { locale: ptBR }) : "Selecione uma data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={watch('birthDate')}
                          onSelect={(date) => setValue('birthDate', date)}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message}</p>}
                  </div>

                  {/* Mais campos de dados pessoais em grades */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Etnia</Label>
                      <Select onValueChange={(value) => setValue('ethnicity', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="branca">Branca</SelectItem>
                          <SelectItem value="preta">Preta</SelectItem>
                          <SelectItem value="parda">Parda</SelectItem>
                          <SelectItem value="amarela">Amarela</SelectItem>
                          <SelectItem value="indigena">Indígena</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profissão</Label>
                      <Input id="profession" {...register('profession')} />
                    </div>
                  </div>

                  {/* Estado Civil e outros campos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Estado Civil</Label>
                      <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="casado">Casado(a)</SelectItem>
                          <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                          <SelectItem value="uniao_estavel">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="spouseName">Nome do(a) Esposo(a)</Label>
                      <Input id="spouseName" {...register('spouseName')} />
                    </div>
                  </div>

                  {/* Dados dos Pais */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Dados dos Pais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="motherName">Nome da Mãe</Label>
                        <Input id="motherName" {...register('motherName')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="motherProfession">Profissão da Mãe</Label>
                        <Input id="motherProfession" {...register('motherProfession')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fatherName">Nome do Pai</Label>
                        <Input id="fatherName" {...register('fatherName')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fatherProfession">Profissão do Pai</Label>
                        <Input id="fatherProfession" {...register('fatherProfession')} />
                      </div>
                    </div>
                  </div>

                  {/* Responsável Legal */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-foreground">Responsável Legal (se menor de idade)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guardianName">Nome do Responsável</Label>
                        <Input id="guardianName" {...register('guardianName')} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guardianCpf">CPF do Responsável</Label>
                        <InputMask
                          mask="999.999.999-99"
                          {...register('guardianCpf')}
                        >
                          {(inputProps) => (
                            <Input {...inputProps} id="guardianCpf" />
                          )}
                        </InputMask>
                      </div>
                    </div>
                  </div>

                  {/* Outros campos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="birthPlace">Local de Nascimento</Label>
                      <Input id="birthPlace" {...register('birthPlace')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nacionalidade</Label>
                      <Input id="nationality" {...register('nationality')} placeholder="Brasileira" />
                    </div>
                  </div>

                  {/* Recém-nascido no plano */}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isNewbornInPlan"
                      onCheckedChange={(checked) => setValue('isNewbornInPlan', checked)}
                    />
                    <Label htmlFor="isNewbornInPlan">Recém-nascido inscrito no plano</Label>
                  </div>

                  {/* Código Legacy */}
                  <div className="space-y-2">
                    <Label htmlFor="legacyCode">Código do Sistema Anterior</Label>
                    <Input id="legacyCode" {...register('legacyCode')} />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Observações e Anexos */}
          <Card className="shadow-card border-border/50">
            <Collapsible open={expandedSections.observations} onOpenChange={() => toggleSection('observations')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-medical-blue" />
                      Observações e Anexos
                    </div>
                    {expandedSections.observations ? <ChevronUp /> : <ChevronDown />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Observações */}
                  <div className="space-y-2">
                    <Label htmlFor="observations">Observações</Label>
                    <Textarea
                      id="observations"
                      {...register('observations')}
                      placeholder="Adicione observações importantes sobre o paciente..."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Upload de Anexos */}
                  <div className="space-y-4">
                    <Label>Anexos</Label>
                    <div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleAttachmentUpload}
                        className="hidden"
                        id="attachment-upload"
                      />
                      <Label htmlFor="attachment-upload" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Adicionar Arquivos
                          </span>
                        </Button>
                      </Label>
                    </div>
                    
                    {/* Lista de anexos */}
                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        <Label>Arquivos Anexados:</Label>
                        <div className="space-y-2">
                          {attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                              <span className="text-sm truncate">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Contato */}
          <Card className="shadow-card border-border/50">
            <Collapsible open={expandedSections.contact} onOpenChange={() => toggleSection('contact')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-medical-blue" />
                      Contato
                    </div>
                    {expandedSections.contact ? <ChevronUp /> : <ChevronDown />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-medical-gray" />
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  {/* Telefones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cellphone">Celular</Label>
                      <InputMask
                        mask="(99) 99999-9999"
                        {...register('cellphone')}
                      >
                        {(inputProps) => (
                          <Input {...inputProps} id="cellphone" />
                        )}
                      </InputMask>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone1">Telefone 1</Label>
                      <InputMask
                        mask="(99) 9999-9999"
                        {...register('phone1')}
                      >
                        {(inputProps) => (
                          <Input {...inputProps} id="phone1" />
                        )}
                      </InputMask>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone2">Telefone 2</Label>
                    <InputMask
                      mask="(99) 9999-9999"
                      {...register('phone2')}
                    >
                      {(inputProps) => (
                        <Input {...inputProps} id="phone2" />
                      )}
                    </InputMask>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Endereço */}
          <Card className="shadow-card border-border/50">
            <Collapsible open={expandedSections.address} onOpenChange={() => toggleSection('address')}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-medical-blue" />
                      Endereço
                    </div>
                    {expandedSections.address ? <ChevronUp /> : <ChevronDown />}
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-6">
                  {/* CEP */}
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <div className="relative">
                      <InputMask
                        mask="99999-999"
                        {...register('cep')}
                      >
                        {(inputProps) => (
                          <Input {...inputProps} id="cep" placeholder="00000-000" />
                        )}
                      </InputMask>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1"
                        onClick={() => watchedCep && searchCEP(watchedCep.replace('-', ''))}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Endereço completo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Rua/Logradouro</Label>
                      <Input id="street" {...register('street')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input id="number" {...register('number')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" {...register('complement')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" {...register('neighborhood')} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" {...register('city')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" {...register('state')} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reference">Ponto de Referência</Label>
                    <Input id="reference" {...register('reference')} placeholder="Ex: Próximo ao mercado..." />
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button type="button" variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-medical-blue hover:bg-medical-blue/90">
              <Save className="h-4 w-4 mr-2" />
              Salvar Paciente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;