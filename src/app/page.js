"use client";

import { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Send, LogOut, Download, PieChart, LayoutGrid, MessageSquare } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './globals.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Home() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { type: 'ai', text: 'Olá! Sou o motor de inteligência da Central de Mídia. Digite sua consulta de inteligência competitiva sobre uma construtora ou incorporadora (ex: "Analise a comunicação de mídia da Construtora Cyrela").' }
  ]);
  const [loading, setLoading] = useState(false);
  const [adImages, setAdImages] = useState([]);
  const [stats, setStats] = useState({ meta: 0, google: 0 });
  const chatEndRef = useRef(null);
  const dashboardRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { type: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMessage.text })
      });

      const data = await response.json();

      if (data.analysis) {
        setMessages(prev => [...prev, { type: 'ai', text: data.analysis }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { type: 'ai', text: 'Houve um erro ao processar a consulta. Tente novamente.' }]);
      }
      
      if (data.adImages) setAdImages(data.adImages);
      if (data.stats) setStats(data.stats);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { type: 'ai', text: 'Erro de conexão com o servidor de inteligência.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const exportPDF = async () => {
    const element = dashboardRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.setFontSize(16);
      pdf.text('Central de Inteligência de Mídia - DATAFIL', 10, 10);
      pdf.setFontSize(10);
      pdf.text('Desenvolvido por Filipe Araújo do Nascimento', 10, 16);
      
      pdf.addImage(imgData, 'PNG', 0, 25, pdfWidth, pdfHeight);
      pdf.save('Relatorio_Inteligencia_Midia.pdf');
    } catch (error) {
      console.error('Erro ao exportar PDF', error);
      alert('Erro ao exportar PDF. Verifique os logs.');
    }
  };

  const chartData = {
    labels: ['Meta Ads', 'Google Ads'],
    datasets: [
      {
        label: 'Volume Estimado de Peças',
        data: [stats.meta, stats.google],
        backgroundColor: ['rgba(236, 72, 153, 0.7)', 'rgba(79, 70, 229, 0.7)'],
        borderColor: ['#ec4899', '#4f46e5'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="app-container" ref={dashboardRef}>
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
             <PieChart size={24} />
          </div>
          <div className="brand-text">
            <h1>Central de Inteligência de Mídia</h1>
            <span>Google & Meta Ads Analyzer</span>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} />
          Sair do Sistema
        </button>
      </header>

      <main className="dashboard-grid">
        {/* Left Column: Chat */}
        <section className="panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header">
            <h2 className="panel-title">
              <MessageSquare size={20} className="text-accent" />
              Processador Conversacional
            </h2>
          </div>
          
          <div className="chat-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      <br/>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message ai">
                <div className="message-bubble typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="input-area">
            <textarea
              className="input-box"
              placeholder="Digite sua consulta (ex: Análise da Construtora X)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={loading || !query.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </section>

        {/* Right Column: Visuals */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Chart Panel */}
          <div className="panel">
             <div className="panel-header">
                <h2 className="panel-title">
                  <PieChart size={20} />
                  Gráfico Comparativo de Mídia
                </h2>
             </div>
             <div className="chart-container">
               {stats.meta > 0 || stats.google > 0 ? (
                  <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
               ) : (
                 <div className="empty-state">
                   <PieChart size={48} opacity={0.3} />
                   <p>Aguardando dados da consulta</p>
                 </div>
               )}
             </div>
          </div>

          {/* Ad Showcase Panel */}
          <div className="panel" style={{ flex: 1 }}>
             <div className="panel-header">
                <h2 className="panel-title">
                  <LayoutGrid size={20} />
                  Prancha de Criativos (Gallery)
                </h2>
             </div>
             
             {adImages.length > 0 ? (
               <div className="gallery-grid">
                  {adImages.map((img, idx) => (
                     <div className="ad-card" key={idx}>
                       <img src={img.url} alt={`Criativo ${idx+1}`} className="ad-image" />
                       <div className="ad-meta">{img.platform} Ad</div>
                     </div>
                  ))}
               </div>
             ) : (
                <div className="empty-state">
                   <LayoutGrid size={48} opacity={0.3} />
                   <p>Nenhuma peça publicitária capturada ainda</p>
                 </div>
             )}
          </div>
          
        </section>
      </main>

      <div className="action-bar">
        <button className="export-btn" onClick={exportPDF}>
          <Download size={20} />
          Exportar Relatório PDF Estruturado
        </button>
      </div>
    </div>
  );
}
