import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import { Pencil, Trash2 } from "lucide-react";
import { formatCurrencyBRL } from "@/utils/dateHelpers";

export default function ServiceTable({ services, onEdit, onDelete }) {
  return (
    <TableContainer sx={{ borderRadius: "12px", border: "1px solid #DED6C4", backgroundColor: "#FFFDF8" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Serviço</TableCell>
            <TableCell>Categoria</TableCell>
            <TableCell align="right">Duração</TableCell>
            <TableCell align="right">Respiro</TableCell>
            <TableCell align="right">Preço</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {services.map((s) => (
            <TableRow key={s.id} hover>
              <TableCell sx={{ fontWeight: 500 }}>{s.name}</TableCell>
              <TableCell>
                <Chip label={s.category} size="small" sx={{ bgcolor: "#5C7F5A26", color: "#24534A" }} />
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: "IBM Plex Mono" }}>
                {s.durationMinutes} min
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: "IBM Plex Mono" }}>
                {s.bufferMinutes} min
              </TableCell>
              <TableCell align="right" sx={{ fontFamily: "IBM Plex Mono", fontWeight: 600 }}>
                {formatCurrencyBRL(s.price)}
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => onEdit(s)}>
                  <Pencil className="h-4 w-4" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(s.id)}>
                  <Trash2 className="h-4 w-4" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ color: "#6B756F", py: 4 }}>
                Nenhum serviço cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
