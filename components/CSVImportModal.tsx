import React, { useState, useRef } from 'react';
import { XMarkIcon, DocumentArrowUpIcon, CheckCircleIcon, ExclamationCircleIcon } from './icons';

interface CSVImportResult {
  validated: string[];
  notFound: string[];
  errors: string[];
}

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: CSVImportResult) => void;
  onValidateBatch: (matriculas: string[]) => Promise<CSVImportResult>;
}

const CSVImportModal: React.FC<CSVImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onImportComplete,
  onValidateBatch 
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CSVImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Por favor, selecione um arquivo CSV válido.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const parseCSV = (text: string): string[] => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const matriculas: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Pular cabeçalho (primeira linha se contiver texto não numérico)
      if (i === 0 && /[a-zA-Z]/.test(line)) {
        continue;
      }

      // Extrair matrícula (pode estar em qualquer coluna, separado por vírgula ou ponto-e-vírgula)
      const columns = line.split(/[,;]/).map(col => col.trim());
      
      for (const col of columns) {
        // Verificar se é uma matrícula válida (apenas números ou formato específico)
        if (col && /^\d+$/.test(col)) {
          matriculas.push(col);
          break; // Pegar apenas a primeira matrícula válida da linha
        }
      }
    }

    return matriculas;
  };

  const handleImport = async () => {
    if (!file) {
      setError('Por favor, selecione um arquivo CSV.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const text = await file.text();
      const matriculas = parseCSV(text);

      if (matriculas.length === 0) {
        setError('Nenhuma matrícula válida encontrada no arquivo CSV.');
        setLoading(false);
        return;
      }

      // Validar matrículas em lote
      const importResult = await onValidateBatch(matriculas);
      setResult(importResult);
      onImportComplete(importResult);
    } catch (err) {
      console.error('Erro ao processar CSV:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivo CSV.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-brand-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-gray-800">Importar Matrículas CSV</h2>
            <button
              onClick={handleClose}
              className="text-brand-gray-400 hover:text-brand-gray-600 transition-colors"
              aria-label="Fechar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!result ? (
            <>
              <div className="mb-6">
                <p className="text-sm text-brand-gray-600 mb-4">
                  Faça upload de um arquivo CSV contendo as matrículas que deseja validar automaticamente.
                  O sistema irá comparar com as matrículas pendentes e validar as que coincidirem.
                </p>
                
                <div className="bg-brand-blue-50 border border-brand-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-semibold text-brand-blue-800 mb-2">Formato do arquivo:</h3>
                  <ul className="text-sm text-brand-blue-700 space-y-1">
                    <li>• Arquivo CSV com uma matrícula por linha</li>
                    <li>• Pode conter cabeçalho (será ignorado)</li>
                    <li>• Aceita separadores: vírgula (,) ou ponto-e-vírgula (;)</li>
                    <li>• Exemplo: 202301, 202302, 202303</li>
                  </ul>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div 
                  onClick={handleSelectFile}
                  className="border-2 border-dashed border-brand-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-brand-blue-500 hover:bg-brand-blue-50 transition-colors"
                >
                  <DocumentArrowUpIcon className="w-12 h-12 text-brand-gray-400 mx-auto mb-3" />
                  {file ? (
                    <div>
                      <p className="text-sm font-semibold text-brand-gray-800">{file.name}</p>
                      <p className="text-xs text-brand-gray-500 mt-1">Clique para selecionar outro arquivo</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-brand-gray-800">Clique para selecionar arquivo CSV</p>
                      <p className="text-xs text-brand-gray-500 mt-1">ou arraste e solte aqui</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-brand-gray-700 bg-white rounded-lg border border-brand-gray-300 hover:bg-brand-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file || loading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processando...
                    </>
                  ) : (
                    'Importar e Validar'
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">Resultado da Importação</h3>
                
                {result.validated.length > 0 && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircleIcon className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 mb-2">
                          {result.validated.length} {result.validated.length === 1 ? 'matrícula validada' : 'matrículas validadas'} com sucesso:
                        </p>
                        <div className="max-h-32 overflow-y-auto">
                          <ul className="text-sm text-green-700 space-y-1">
                            {result.validated.map((matricula, index) => (
                              <li key={index}>• {matricula}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {result.notFound.length > 0 && (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-yellow-800 mb-2">
                          {result.notFound.length} {result.notFound.length === 1 ? 'matrícula não encontrada' : 'matrículas não encontradas'} ou já processada:
                        </p>
                        <div className="max-h-32 overflow-y-auto">
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {result.notFound.map((matricula, index) => (
                              <li key={index}>• {matricula}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {result.errors.length > 0 && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start">
                      <ExclamationCircleIcon className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800 mb-2">
                          Erros ao processar {result.errors.length} {result.errors.length === 1 ? 'matrícula' : 'matrículas'}:
                        </p>
                        <div className="max-h-32 overflow-y-auto">
                          <ul className="text-sm text-red-700 space-y-1">
                            {result.errors.map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CSVImportModal;
