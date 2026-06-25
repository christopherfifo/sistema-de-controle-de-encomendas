import re

with open("src/app/(app)/[slug]/components/financeiroContent.tsx", "r") as f:
    content = f.read()

# Replace CreditCardData interface
content = re.sub(
    r'interface CreditCardData \{.*?\}',
    'interface CreditCardData {\n  id: string;\n  ultimos_digitos: string;\n  bandeira: string;\n  mes_expiracao: number;\n  ano_expiracao: number;\n  titular: string;\n  tipo: string;\n  gateway_token: string;\n}',
    content,
    flags=re.DOTALL
)

# Update initial state of cards
content = re.sub(
    r'const \[cards, setCards\] = useState<CreditCardData\[\]>\(\[.*?\]\);',
    '''const [cards, setCards] = useState<CreditCardData[]>([
    { 
      id: "1", 
      ultimos_digitos: "1234", 
      bandeira: "Visa", 
      mes_expiracao: 12,
      ano_expiracao: 28,
      titular: "JOÃO SILVA",
      tipo: "CREDITO",
      gateway_token: "tok_mock_12345"
    }
  ]);''',
    content,
    flags=re.DOTALL
)

# Remove revealedCards state
content = re.sub(r'const \[revealedCards, setRevealedCards\] = useState<Record<string, boolean>>\(\{\}\);\n', '', content)

# Remove toggleReveal
content = re.sub(r'  const toggleReveal = \(id: string\) => \{.*?  \};\n\n', '', content, flags=re.DOTALL)

# Update handleAddOrEditCard
content = re.sub(
    r'  const handleAddOrEditCard = \(e: React\.FormEvent\) => \{.*?\n  \};\n',
    '''  const handleAddOrEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber || !newCardName || !newCardExpiry || !newCardCvv) return;

    const brand = getCardBrand(newCardNumber) || "Desconhecida";
    const ultimos_digitos = newCardNumber.slice(-4);
    const partesData = newCardExpiry.split('/');
    const mes_expiracao = parseInt(partesData[0], 10);
    const ano_expiracao = parseInt(partesData[1], 10) + 2000;

    const newCard = {
        id: editingCardId || Math.random().toString(36).substring(2, 9),
        ultimos_digitos,
        bandeira: brand,
        mes_expiracao,
        ano_expiracao,
        titular: newCardName,
        tipo: "CREDITO",
        gateway_token: "tok_mock_" + Math.random().toString(36).substring(2, 9)
    };

    if (editingCardId) {
      setCards(cards.map(card => card.id === editingCardId ? newCard : card));
      setEditingCardId(null);
    } else {
      setCards([...cards, newCard]);
    }

    setNewCardNumber("");
    setNewCardName("");
    setNewCardExpiry("");
    setNewCardCvv("");
  };
''',
    content,
    flags=re.DOTALL
)

# Remove startEditing
content = re.sub(r'  const startEditing = \(card: CreditCardData\) => \{.*?  \};\n\n', '', content, flags=re.DOTALL)


# Update the cards map render logic
card_render_old = r'\{cards\.map\(card => \{.*?const displayNum = isRevealed \? card\.fullNumber : `\*\*\*\* \*\*\*\* \*\*\*\* \$\{card\.fullNumber\.slice\(-4\)\}`;.*?<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">.*?</Button>\n                          </div>\n                        </div>\n                      \);\n                    \}\)'

card_render_new = '''{cards.map(card => {
                    const displayNum = `**** **** **** ${card.ultimos_digitos}`;

                    return (
                      <div key={card.id} className="flex flex-col p-4 border rounded-lg bg-card gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0 w-full">
                            <div className="h-10 w-14 bg-muted flex items-center justify-center rounded text-xs font-bold uppercase shrink-0">
                              {card.bandeira}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium tracking-widest truncate">{displayNum}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2 mt-2">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveCard(card.id)} className="text-destructive shrink-0">
                            <Trash2 className="h-4 w-4 shrink-0" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}'''

content = re.sub(r'\{cards\.map\(card => \{.*?\n                    \}\)\}', card_render_new, content, flags=re.DOTALL)

# Update Invoice mapping (paidWith usage)
content = content.replace("c?.fullNumber.slice(-4)", "c?.ultimos_digitos")
content = content.replace("c.brand", "c.bandeira")
content = content.replace("c.fullNumber.slice(-4)", "c.ultimos_digitos")

with open("src/app/(app)/[slug]/components/financeiroContent.tsx", "w") as f:
    f.write(content)

