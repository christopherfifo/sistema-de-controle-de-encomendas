"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Wallet, CreditCard, Trash2, Plus, Eye, EyeOff, Edit, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import jsPDF from "jspdf";

interface CreditCardData {
  id: string;
  fullNumber: string;
  brand: string;
  expiry: string;
  name: string;
  cvv: string;
}

type InvoiceStatus = "PENDENTE" | "ATRASADA" | "PAGO";

interface Invoice {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  paymentDate?: string;
  paidWith?: string;
}

export function FinanceiroContent() {
  const [cards, setCards] = useState<CreditCardData[]>([
    { 
      id: "1", 
      fullNumber: "4111 1111 1111 1234", 
      brand: "Visa", 
      expiry: "12/28", 
      name: "JOÃO SILVA",
      cvv: "123"
    }
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "1", title: "Fatura de Maio 2026", dueDate: "2026-05-10", amount: 199.90, status: "PAGO", paymentDate: "05/05/2026", paidWith: "Cartão de Crédito final 1234" },
    { id: "2", title: "Fatura de Junho 2026", dueDate: "2026-06-10", amount: 199.90, status: "PENDENTE" },
    { id: "3", title: "Fatura de Julho 2026", dueDate: "2026-07-10", amount: 199.90, status: "PENDENTE" },
    { id: "4", title: "Fatura de Abril 2026", dueDate: "2026-04-10", amount: 199.90, status: "ATRASADA" },
  ]);
  
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardName, setNewCardName] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  
  const [revealedCards, setRevealedCards] = useState<Record<string, boolean>>({});
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);
  const [selectedCardId, setSelectedCardId] = useState<string>("");

  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const getCardBrand = (number: string) => {
    const cleanNumber = number.replace(/\D/g, "");
    if (/^4/.test(cleanNumber)) return "Visa";
    if (/^5[1-5]/.test(cleanNumber)) return "Mastercard";
    if (/^3[47]/.test(cleanNumber)) return "Amex";
    if (/^6(?:011|5)/.test(cleanNumber)) return "Discover";
    if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return "Diners Club";
    if (/^((5067)|(4576)|(4011))/.test(cleanNumber)) return "Elo";
    if (cleanNumber.length > 0) return "Desconhecido";
    return "";
  };

  const handleAddOrEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardName || !newCardExpiry || !newCardCvv) return;

    const brand = getCardBrand(newCardNumber) || "Desconhecido";

    if (editingCardId) {
      setCards(cards.map(card => card.id === editingCardId ? {
        ...card,
        fullNumber: newCardNumber,
        brand,
        expiry: newCardExpiry,
        name: newCardName,
        cvv: newCardCvv
      } : card));
      setEditingCardId(null);
    } else {
      setCards([...cards, {
        id: Math.random().toString(36).substring(2, 9),
        fullNumber: newCardNumber,
        brand,
        expiry: newCardExpiry,
        name: newCardName,
        cvv: newCardCvv
      }]);
    }

    setNewCardNumber("");
    setNewCardName("");
    setNewCardExpiry("");
    setNewCardCvv("");
  };

  const startEditing = (card: CreditCardData) => {
    setEditingCardId(card.id);
    setNewCardNumber(card.fullNumber);
    setNewCardName(card.name);
    setNewCardExpiry(card.expiry);
    setNewCardCvv(card.cvv);
  };

  const handleRemoveCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
    if (editingCardId === id) {
      setEditingCardId(null);
      setNewCardNumber("");
      setNewCardName("");
      setNewCardExpiry("");
      setNewCardCvv("");
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setNewCardNumber(value);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setNewCardExpiry(value);
  };

  const handlePayInvoice = () => {
    if (!payingInvoiceId) return;
    setIsPaying(true);
    
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
      
      const card = cards.find(c => c.id === selectedCardId) || cards[0];
      const today = new Date().toLocaleDateString('pt-BR');

      setInvoices(invoices.map(inv => {
        if (inv.id === payingInvoiceId) {
          return {
            ...inv,
            status: "PAGO",
            paymentDate: today,
            paidWith: `Cartão de Crédito final ${card?.fullNumber.slice(-4) || 'N/A'}`
          };
        }
        return inv;
      }));

      setTimeout(() => {
        setPayingInvoiceId(null);
        setPaymentSuccess(false);
      }, 2000);
    }, 1500);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Comprovante de Pagamento", 20, 20);
    doc.setFontSize(12);
    doc.text(`Fatura: ${invoice.title}`, 20, 40);
    doc.text(`Valor: R$ ${invoice.amount.toFixed(2).replace('.', ',')}`, 20, 50);
    doc.text(`Vencimento Original: ${invoice.dueDate.split('-').reverse().join('/')}`, 20, 60);
    doc.text(`Data de Pagamento: ${invoice.paymentDate || 'N/A'}`, 20, 70);
    doc.text(`Forma de Pagamento: ${invoice.paidWith || 'N/A'}`, 20, 80);
    doc.text(`Status: PAGO`, 20, 90);
    doc.save(`comprovante_${invoice.title.replace(/\s+/g, '_')}.pdf`);
  };

  const overdueInvoices = invoices
    .filter(inv => inv.status === "ATRASADA")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const nextInvoice = invoices
    .filter(inv => inv.status === "PENDENTE")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  const pendingInvoices = invoices
    .filter(inv => inv.status !== "PAGO" && inv.id !== nextInvoice?.id && !overdueInvoices.find(o => o.id === inv.id));

  const paidInvoices = invoices
    .filter(inv => inv.status === "PAGO")
    .filter(inv => {
      if (!filterMonth && !filterYear) return true;
      const [invYear, invMonth] = inv.dueDate.split('-');
      const matchMonth = filterMonth ? invMonth === filterMonth : true;
      const matchYear = filterYear ? invYear === filterYear : true;
      return matchMonth && matchYear;
    });

  const renderPaymentDialog = (invoice: Invoice) => (
    <Dialog open={payingInvoiceId === invoice.id} onOpenChange={(open) => {
      if (open) setPayingInvoiceId(invoice.id);
      else if (!isPaying && !paymentSuccess) setPayingInvoiceId(null);
    }}>
      <DialogTrigger asChild>
        <Button variant={invoice.status === 'ATRASADA' ? "destructive" : "default"} size="sm">
          Pagar Agora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {!paymentSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle>Pagamento da Fatura</DialogTitle>
              <DialogDescription>
                Escolha a forma de pagamento para quitar a {invoice.title}.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Valor Total</span>
                  <span className="font-bold text-lg">R$ {invoice.amount.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="space-y-2">
                  <Label>Cartão Selecionado</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedCardId}
                    onChange={(e) => setSelectedCardId(e.target.value)}
                  >
                    <option value="" disabled>Selecione um cartão</option>
                    {cards.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.brand} final {c.fullNumber.slice(-4)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <Button onClick={handlePayInvoice} disabled={isPaying || cards.length === 0 || !selectedCardId} className="w-full">
              {isPaying ? "Processando..." : "Confirmar Pagamento"}
            </Button>
            {cards.length === 0 && (
              <p className="text-xs text-red-500 mt-2 text-center">Cadastre um cartão na aba Cartões para pagar.</p>
            )}
          </>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle>Pagamento Aprovado!</DialogTitle>
            <DialogDescription>
              Sua fatura foi paga com sucesso.
            </DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financeiro</h2>
        <p className="text-muted-foreground">
          Gerencie suas faturas, histórico de pagamentos e cartões.
        </p>
      </div>

      <Tabs defaultValue="faturas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="pagamentos">Histórico</TabsTrigger>
          <TabsTrigger value="cartoes">Cartões</TabsTrigger>
        </TabsList>
        
        <TabsContent value="faturas" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Minhas Faturas</CardTitle>
              </div>
              <CardDescription>Acesse faturas pendentes e atrasadas.</CardDescription>
            </CardHeader>
            <CardContent>
              {overdueInvoices.length > 0 && (
                <div className="mb-6 space-y-4">
                  {overdueInvoices.map(overdueInvoice => (
                    <div key={overdueInvoice.id} className="rounded-lg border-l-4 border-l-red-600 bg-red-50 dark:bg-red-950/20 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Fatura Atrasada</p>
                        <p className="font-medium text-lg text-red-950 dark:text-red-50">{overdueInvoice.title}</p>
                        <p className="text-sm text-red-800 dark:text-red-200">Vencimento: {overdueInvoice.dueDate.split('-').reverse().join('/')}</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                        <div className="text-right">
                          <p className="font-bold text-lg text-red-600 dark:text-red-400">
                            R$ {overdueInvoice.amount.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                        {renderPaymentDialog(overdueInvoice)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {nextInvoice && (
                <div className="mb-8 rounded-lg border-l-4 border-l-primary bg-primary/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Próxima Fatura</p>
                    <p className="font-medium text-lg">{nextInvoice.title}</p>
                    <p className="text-sm text-muted-foreground">Vencimento: {nextInvoice.dueDate.split('-').reverse().join('/')}</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        R$ {nextInvoice.amount.toFixed(2).replace('.', ',')}
                      </p>
                      <p className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                        {nextInvoice.status}
                      </p>
                    </div>
                    {renderPaymentDialog(nextInvoice)}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {pendingInvoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-md bg-muted/10">
                    Nenhuma outra fatura pendente ou atrasada.
                  </p>
                ) : (
                  pendingInvoices.map(invoice => (
                    <div key={invoice.id} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
                      <div>
                        <p className="font-medium">{invoice.title}</p>
                        <p className="text-sm text-muted-foreground">Vencimento: {invoice.dueDate.split('-').reverse().join('/')}</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                        <span className={`font-bold ${invoice.status === 'ATRASADA' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                          {invoice.status}
                        </span>
                        {renderPaymentDialog(invoice)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pagamentos" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <CardTitle>Histórico de Pagamentos</CardTitle>
              </div>
              <CardDescription>Visualize e baixe comprovantes das faturas pagas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex flex-col sm:flex-row gap-4 bg-muted/30 p-4 rounded-lg">
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="filterMonth">Mês</Label>
                  <select 
                    id="filterMonth" 
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Todos os meses</option>
                    <option value="01">Janeiro</option>
                    <option value="02">Fevereiro</option>
                    <option value="03">Março</option>
                    <option value="04">Abril</option>
                    <option value="05">Maio</option>
                    <option value="06">Junho</option>
                    <option value="07">Julho</option>
                    <option value="08">Agosto</option>
                    <option value="09">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                  </select>
                </div>
                <div className="w-full sm:w-1/3">
                  <Label htmlFor="filterYear">Ano</Label>
                  <select 
                    id="filterYear" 
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Todos os anos</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                  </select>
                </div>
                <div className="flex items-end">
                   <Button variant="outline" onClick={() => { setFilterMonth(""); setFilterYear(""); }}>
                     Limpar Filtros
                   </Button>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {paidInvoices.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-md bg-muted/10">Nenhum pagamento efetuado para este período.</p>
                ) : (
                  paidInvoices.map(invoice => (
                    <div key={invoice.id} className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-2">
                      <div>
                        <p className="font-medium">{invoice.title}</p>
                        <p className="text-sm text-muted-foreground">{invoice.paidWith}</p>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="text-left md:text-right">
                          <p className="font-bold text-green-600">R$ {invoice.amount.toFixed(2).replace('.', ',')}</p>
                          <p className="text-sm text-muted-foreground">Pago em: {invoice.paymentDate}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(invoice)}>
                          Baixar PDF
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cartoes" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Meus Cartões</CardTitle>
              </div>
              <CardDescription>Gerencie suas formas de pagamento salvas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cards.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum cartão salvo.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {cards.map(card => {
                    const isRevealed = revealedCards[card.id];
                    const displayNum = isRevealed 
                      ? card.fullNumber 
                      : `**** **** **** ${card.fullNumber.slice(-4)}`;

                    return (
                      <div key={card.id} className="flex flex-col p-4 border rounded-lg bg-card gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-14 bg-muted flex items-center justify-center rounded text-xs font-bold uppercase shrink-0">
                              {card.brand}
                            </div>
                            <div>
                              <p className="font-medium tracking-widest">{displayNum}</p>
                              {isRevealed && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  Nome: {card.name} | Exp: {card.expiry} | CVV: {card.cvv}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <Button variant="outline" size="sm" onClick={() => toggleReveal(card.id)}>
                            {isRevealed ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                            {isRevealed ? "Ocultar" : "Ver Dados"}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => startEditing(card)}>
                            <Edit className="h-4 w-4 mr-1" /> Editar
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveCard(card.id)} className="text-destructive shrink-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{editingCardId ? "Editar Cartão" : "Adicionar Novo Cartão"}</CardTitle>
              <CardDescription>
                {editingCardId ? "Modifique os dados do cartão selecionado." : "Insira os dados do seu cartão de crédito."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddOrEditCard} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <div className="relative">
                      <Input 
                        id="cardNumber" 
                        placeholder="0000 0000 0000 0000" 
                        value={newCardNumber}
                        onChange={handleNumberChange}
                        maxLength={19}
                        required
                      />
                      {newCardNumber && (
                        <div className="absolute right-3 top-2.5 text-xs font-bold text-muted-foreground uppercase pointer-events-none">
                          {getCardBrand(newCardNumber)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input 
                      id="cardName" 
                      placeholder="NOME IMPRESSO" 
                      value={newCardName}
                      onChange={(e) => setNewCardName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input 
                      id="cardExpiry" 
                      placeholder="MM/AA" 
                      value={newCardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input 
                      id="cardCvv" 
                      placeholder="123" 
                      type="password"
                      value={newCardCvv}
                      onChange={(e) => setNewCardCvv(e.target.value.replace(/\D/g, ""))}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full md:w-auto">
                    {editingCardId ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {editingCardId ? "Salvar Alterações" : "Adicionar Cartão"}
                  </Button>
                  {editingCardId && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setEditingCardId(null);
                        setNewCardNumber("");
                        setNewCardName("");
                        setNewCardExpiry("");
                        setNewCardCvv("");
                      }}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}