import { useState } from 'react';
import { Button } from '../ui/Button';
import styles from './FunctionCard.module.css';

type InputDef = { id: string; placeholder: string; type?: string };
type ApiFunction = (...args: any[]) => Promise<any>;

interface FunctionCardProps {
  title: string;
  inputs?: InputDef[];
  apiFunc: ApiFunction;
}

export const FunctionCard = ({ title, inputs = [], apiFunc }: FunctionCardProps) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (id: string, value: string) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  const handleDoClick = async () => {
    setIsLoading(true);
    setResult(null);

    const args = inputs.map(input => {
      const value = inputValues[input.id] || '';
      return input.type === 'number' ? Number(value) : value;
    });

    try {
      const response = await apiFunc(...args);
      setResult(JSON.stringify(response, null, 2));
    } catch (error: any) {
      setResult(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>

      <p className={styles.title}>{title}</p>

      <div className={styles.controls}>

        {inputs.map((input) => (
          <input
            key={input.id}
            className={styles.input}
            type={input.type || 'text'}
            placeholder={input.placeholder}
            value={inputValues[input.id] || ''}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
        ))}

        <Button onClick={handleDoClick} disabled={isLoading}>
          {isLoading ? 'Executing...' : 'do'}
        </Button>

        {result && (
          <pre className={styles.result}>
            <strong>result: </strong>
            <code>{result}</code>
          </pre>
        )}
      </div>
    </div>
  );
};