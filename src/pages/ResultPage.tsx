
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ResultPreview from '../components/ResultPreview';
import { useApp } from '../context/AppContext';

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedDesign, resetState } = useApp();
  
  // Log the generated design URL for debugging
  useEffect(() => {
    if (generatedDesign) {
      console.log("Generated design URL:", generatedDesign);
    }
  }, [generatedDesign]);
  
  // Redirect if no design
  useEffect(() => {
    if (!generatedDesign) {
      navigate('/');
    }
  }, [generatedDesign, navigate]);

  const handleTryAgain = () => {
    resetState();
    navigate('/');
  };

  if (!generatedDesign) return null;

  return (
    <Layout showBackButton title="Votre design">
      <ResultPreview onTryAgain={handleTryAgain} />
    </Layout>
  );
};

export default ResultPage;
