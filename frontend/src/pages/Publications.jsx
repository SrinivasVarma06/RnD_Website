import React, { useEffect, useState } from "react";
import {
  List, ListItem, Typography, Link, Pagination, Box, TextField
} from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import axios from "axios";
import PageSkeleton from '../components/LoadingSkeleton/PageSkeleton';
import { getApiUrl } from '../config/api';

const PAGE_SIZE = 10;

export default function PublicationsList() {


  const [page, setPage] = useState(1);
  const [publications,setPublications] = useState([]);
  const [loading,setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    setLoading(true);
    axios
    .get(getApiUrl('publications'))
    .then((res) => {
      setPublications(res.data); // reverse for latest first, optional
      setLoading(false);
    })
    .catch(() => setLoading(false));
  },[]);

  const filteredPublications = publications.filter(pub =>
    [pub.Title, pub.Authors, pub["Source title"]]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  useEffect(() => setPage(1), [search]);

  const totalPages = Math.ceil(filteredPublications.length / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginated = filteredPublications.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2 }}>
      <Typography variant="h5" fontWeight="bold" mb={3} align="center">
        PUBLICATIONS
      </Typography>
      <TextField
        fullWidth
        label="Search publications"
        variant="outlined"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ 
            mb: 3 
        }}
      />
      <Typography variant="subtitle1" color="text.primary" mb={2} align="right">
        Total Publications:{" "}
        <span style={{ color: "#7e22ce", fontWeight: 700, fontSize: "1.15em" }}>
          {filteredPublications.length}
        </span>
      </Typography>
      {loading ? (
        <PageSkeleton />
        ) : (
            <>
                <List sx={{ listStyleType: "decimal", pl: 3 }}>
                    {paginated.map((pub, idx) => (
                        <ListItem
                            key={pub.DOI || pub["Serial no."]}
                            sx={{
                            display: "list-item",
                            alignItems: "flex-start",
                            px: 0,
                            mb: 2,
                            '&::marker': {
                                fontWeight: "bold",
                                fontSize: "1.05em"
                            }
                            }}
                        >
                            <Typography variant="body1" component="span">
                            {pub.Authors};{" "}
                            <b>&quot;{pub.Title}&quot;,</b>
                            <i> {pub["Source title"]}</i>
                            {pub.Year && `, ${pub.Year}.`}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 1, ml: -1 }}>
                            <LinkIcon sx={{ fontSize: 18, mr: 0.7, color: "#7e22ce" }} />
                            <Link
                                href={pub.DOI ? `https://doi.org/${pub.DOI}` : "#"}
                                target="_blank"
                                rel="noopener"
                                underline="hover"
                                sx={{
                                color: "#7e22ce",
                                fontWeight: 500,
                                fontSize: "1rem"
                                }}
                            >
                                View the {pub["Document Type"]}
                            </Link>
                            </Box>
                        </ListItem>
                    ))}
                </List>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, val) => setPage(val)}
                        sx={{
                            "& .MuiPaginationItem-root.Mui-selected": {
                            backgroundColor: "#7e22ce",
                            color: "white"
                            }
                        }}
                    />
                </Box>
            </>
        )}
    </Box>
  );
}


