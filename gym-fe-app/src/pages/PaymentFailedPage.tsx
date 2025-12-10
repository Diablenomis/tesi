import { Link } from "react-router-dom";
import { Box, Button, Typography, styled } from "@mui/material";

const PageWrapper = styled(Box)(() => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #f5f7fb 0%, #f9fcff 100%)",
  padding: "32px",
}));

const Card = styled(Box)(() => ({
  maxWidth: 520,
  width: "100%",
  textAlign: "center",
  background: "#ffffff",
  borderRadius: 20,
  boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
  padding: "32px 28px",
}));

const PaymentFailedPage: React.FC = () => {
  return (
    <PageWrapper>
      <Card className="zoom-in">
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Pagamento non riuscito
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Si e verificato un errore durante il pagamento. Riprova tra qualche
          minuto oppure torna alla home per continuare a navigare.
        </Typography>
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            backgroundColor: "#3bc1c4",
            "&:hover": { backgroundColor: "#2aa7a9" },
            padding: "10px 18px",
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Torna alla home
        </Button>
      </Card>
    </PageWrapper>
  );
};

export default PaymentFailedPage;
