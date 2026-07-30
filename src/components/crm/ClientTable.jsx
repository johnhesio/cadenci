import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import { formatDateShort } from "@/utils/dateHelpers";

const ENGAGEMENT_STYLE = {
  alto: { bgcolor: "#5C7F5A26", color: "#3f5a3d" },
  médio: { bgcolor: "#B8842C26", color: "#8a621f" },
  baixo: { bgcolor: "#AD585026", color: "#8a423c" },
};

export default function ClientTable({ clients }) {
  return (
    <TableContainer sx={{ borderRadius: "12px", border: "1px solid #DED6C4", backgroundColor: "#FFFDF8" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>WhatsApp</TableCell>
            <TableCell align="right">Nº agendamentos</TableCell>
            <TableCell>Engajamento</TableCell>
            <TableCell align="right">Última visita</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id} hover>
              <TableCell sx={{ fontWeight: 500 }}>{c.name}</TableCell>
              <TableCell sx={{ fontFamily: "IBM Plex Mono", fontSize: "0.85rem" }}>{c.whatsapp}</TableCell>
              <TableCell align="right" sx={{ fontFamily: "IBM Plex Mono" }}>
                {c.totalAppointments}
              </TableCell>
              <TableCell>
                <Chip label={c.engagement} size="small" sx={ENGAGEMENT_STYLE[c.engagement]} />
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: "IBM Plex Mono" }}>
                {c.lastVisit ? formatDateShort(c.lastVisit) : "—"}
              </TableCell>
            </TableRow>
          ))}
          {clients.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: "#6B756F", py: 4 }}>
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
