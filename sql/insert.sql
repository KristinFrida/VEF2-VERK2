INSERT INTO categories (name) VALUES
  ('HTML'),
  ('CSS'),
  ('JavaScript')
ON CONFLICT (name) DO NOTHING;

INSERT INTO spurningar (category_id, spurning) VALUES
  ((SELECT id FROM categories WHERE name = 'HTML'), 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?'),
  ((SELECT id FROM categories WHERE name = 'HTML'), 'Í <head> á vefjum setjum við <meta charset="utf-8"> (eða það stafasett sem nota á), af hverju er það gert?'),
  ((SELECT id FROM categories WHERE name = 'HTML'), 'Það sem við getum gert til að forrita aðgengilega vefi er'),
  ((SELECT id FROM categories WHERE name = 'HTML'), 'Hvað er merkingarfræði í sambandi við námsefnið?')
ON CONFLICT (spurning) DO NOTHING;

INSERT INTO spurningar (category_id, spurning) VALUES
  ((SELECT id FROM categories WHERE name = 'CSS'), 'Fyrir eftirfarandi HTML, hvaða CSS á við?'),
  ((SELECT id FROM categories WHERE name = 'CSS'), 'Ef við notum nýtt litagildi í CSS sem er ekki stutt í öllum vöfrum, hvað eigum við að gera?'),
  ((SELECT id FROM categories WHERE name = 'CSS'), 'Í verkefnum höfum við unnið með „containers“ og „items“, hvað á það við?'),
  ((SELECT id FROM categories WHERE name = 'CSS'), 'Þegar við notum flexbox, hvað er satt?')
ON CONFLICT (spurning) DO NOTHING;

INSERT INTO spurningar (category_id, spurning) VALUES
  ((SELECT id FROM categories WHERE name = 'JavaScript'), 'Hvað er skrifað út eftir að eftirfarandi kóði er keyrður?'),
  ((SELECT id FROM categories WHERE name = 'JavaScript'), 'Þegar við berum saman gildi í JavaScript, hvaða samanburður ætti að vera notaður?'),
  ((SELECT id FROM categories WHERE name = 'JavaScript'), 'Hvernig á að nota `fetch` í JavaScript?')
ON CONFLICT (spurning) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?'), '<a href="about.html">About</a>', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?'), '<form method="get" action="about.html"><button>About</button></form>', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?'), 'Allar jafn góðar', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við værum að smíða vefsíðu og myndum vilja geta farið frá index.html yfir á about.html, hvað væri best að nota?'), '<button to="about.html">About</button>', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Í <head> á vefjum setjum við <meta charset="utf-8"> (eða það stafasett sem nota á), af hverju er það gert?'), 'Þannig að stafir birtist rétt.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Í <head> á vefjum setjum við <meta charset="utf-8"> (eða það stafasett sem nota á), af hverju er það gert?'), 'Skilgreining sem visual studio verður að hafa þannig að prettier virki rétt.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Í <head> á vefjum setjum við <meta charset="utf-8"> (eða það stafasett sem nota á), af hverju er það gert?'), 'Skilgreining sem aXe krefur okkur um til að vefur verði aðgengilegur.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Í <head> á vefjum setjum við <meta charset="utf-8"> (eða það stafasett sem nota á), afhverju er það gert?'), 'Ekkert af þessu.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Það sem við getum gert til að forrita aðgengilega vefi er'), 'Allt af þessu.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Það sem við getum gert til að forrita aðgengilega vefi er'), 'Nota eingöngu lyklaborð við að skoða og nota vefinn.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Það sem við getum gert til að forrita aðgengilega vefi er'), 'Merkja form á aðgengilegan hátt.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Það sem við getum gert til að forrita aðgengilega vefi er'), 'Hafa tóman alt texta á myndum ef þær eru eingöngu til skrauts.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er merkingarfræði í sambandi við námsefnið?'), 'Hvert HTML element hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er merkingarfræði í sambandi við námsefnið?'), 'Hvert HTML tag hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er merkingarfræði í sambandi við námsefnið?'), 'Hvert CSS eigindi hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er merkingarfræði í sambandi við námsefnið?'), 'Hver CSS selector hefur einhverja skilgreinda merkingu—merkingarfræðilegt gildi—sem við þurfum að hafa í huga þegar við smíðum vefi.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Fyrir eftirfarandi HTML, hvaða CSS á við?'), 'font-size: 20px; color: green;', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Fyrir eftirfarandi HTML, hvaða CSS á við?'), 'font-size: 15px; color: red;', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Fyrir eftirfarandi HTML, hvaða CSS á við?'), 'font-size: 20px; color: red;', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Fyrir eftirfarandi HTML, hvaða CSS á við?'), 'font-size: 15px; color: green;', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við notum nýtt litagildi í CSS sem er ekki stutt í öllum vöfrum, hvað eigum við að gera?'), 'Skilgreina fallback gildi á undan nýja gildinu sem væri notað í stað þess ef það er ekki stutt', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við notum nýtt litagildi í CSS sem er ekki stutt í öllum vöfrum, hvað eigum við að gera?'), 'Skilgreina fallback gildi á eftir nýja gildinu sem væri notað í stað þess ef það er ekki stutt.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við notum nýtt litagildi í CSS sem er ekki stutt í öllum vöfrum, hvað eigum við að gera?'), 'Setja upp JavaScript virkni sem bendir notanda á að sækja nýjann vafra sem styður gildið.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Ef við notum nýtt litagildi í CSS sem er ekki stutt í öllum vöfrum, hvað eigum við að gera?'), 'Þetta er ekki stutt í CSS.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Í verkefnum höfum við unnið með „containers“ og „items“, hvað á það við?'), '„Flex container“ og „flex items; „grid container“ og „grid items“: greinarmunur á foreldri og börnum þegar flexbox og CSS grid er notað.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Í verkefnum höfum við unnið með „containers“ og „items“, hvað á það við?'), '„Flex container“ og „flex items: greinarmunur á foreldri og börnum eingöngu þegar flexbox er notað.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Í verkefnum höfum við unnið með „containers“ og „items“, hvað á það við?'), '„Grid container“ og „grid items“: greinarmunur á foreldri og börnum eingöngu þegar grid er notað.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Í verkefnum höfum við unnið með „containers“ og „items“, hvað á það við?'), 'Hugtök sem eru notuð með `querySelectorAll`: „container“ er það element sem leitað er undir, „items“ það sem er skilað.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við notum flexbox, hvað er satt?'), 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru hornréttir; sjálfgefin röðun er á aðalás frá vinstri til hægri.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við notum flexbox, hvað er satt?'), 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru samsíða; sjálfgefin röðun er á aðalás frá vinstri til hægri.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við notum flexbox, hvað er satt?'), 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru hornréttir; sjálfgefin röðun er á krossás frá vinstri til hægri.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við notum flexbox, hvað er satt?'), 'Höfum skilgreinda tvo ása: aðalás og krossás sem eru samsíða; sjálfgefin röðun er á krossás frá vinstri til hægri.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er skrifað út eftir að eftirfarandi kóði er keyrður?'), '8', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er skrifað út eftir að eftirfarandi kóði er keyrður?'), '[8]', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er skrifað út eftir að eftirfarandi kóði er keyrður?'), 'Uncaught ReferenceError: item is not defined', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvað er skrifað út eftir að eftirfarandi kóði er keyrður?'), 'undefined', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við berum saman gildi í JavaScript, hvaða samanburður ætti að vera notaður?'), 'Þessi samanburður byrjar á að bera saman týpur gilda og kemst því framhjá type coercion sem gerist með samanburð með tveimur samasem merkjum.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við berum saman gildi í JavaScript, hvaða samanburður ætti að vera notaður?'), 'Við ættum alltaf að nota tvö samasem merki, ekki þrjú því þá byrjum við á að bera saman týpur gilda og komumst þannig framhjá type coercion.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við berum saman gildi í JavaScript, hvaða samanburður ætti að vera notaður?'), 'Þessi samanburður kemst framhjá truthy og falsy gildum og skilar eingöngu réttum niðurstöðum fyrir primitive gildi.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Þegar við berum saman gildi í JavaScript, hvaða samanburður ætti að vera notaður?'), 'Þessi samanburður nýtir lógíska virkja sem virka aðeins í tvístæðum.', false)
ON CONFLICT (svor_text) DO NOTHING;

INSERT INTO svor (spurning_id, svor_text, correct)
VALUES
  ((SELECT id FROM spurningar WHERE spurning = 'Hvernig á að nota `fetch` í JavaScript?'), 'Búið til `fetch` request kall sem tilgreinir að minnsta kosti URL; villuathugun á kalli og svari með tilliti til HTTP; gögn sótt í response með villuathugun.', true),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvernig á að nota `fetch` í JavaScript?'), 'Búið til `fetch` request kall sem verður að tilgreina URL, HTTP aðferð og stöðukóða; villuathugun á kalli og svari með tilliti til HTTP; gögn sótt í response með villuathugun.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvernig á að nota `fetch` í JavaScript?'), 'Búið til `fetch` request kall sem tilgreinir að minnsta kosti URL; villuathugun á kalli og svari með tilliti til URL; gögn sótt í response.', false),
  ((SELECT id FROM spurningar WHERE spurning = 'Hvernig á að nota `fetch` í JavaScript?'), 'Búið til `fetch` request kall sem tilgreinir að minnsta kosti URL; villuathugun á kalli og svari með tilliti til HTTP; eingöngu JSON gögn sótt í response með villuathugun.', false)
ON CONFLICT (svor_text) DO NOTHING;
