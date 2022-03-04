import * as React from "react";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { Navigate, useParams } from "react-router-dom";

function JoinO(props) {
	const [redirect, setRedirect] = React.useState(null);
	const [windowWidth, setWindowWidth] = React.useState(
		window.innerWidth > 768 ? "50%" : window.innerWidth - 35
	);

	let params = useParams();

	React.useEffect(() => {
		window.addEventListener("resize", handleResize);
		joinAsO();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const handleResize = () => {
		const windowWidth = window.innerWidth;
		setWindowWidth(windowWidth > 768 ? "60%" : windowWidth - 35);
	};

	const joinAsO = () => {
		const requestOptions = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ secret: params.secretO }),
		};

		fetch(
			process.env.REACT_APP_API_URL + `/events/${params.secretO}/edit`,
			requestOptions
		)
			.then((response) => response.json())
			.then((data) => setRedirect(`/o/event/${data.code}`))
			.catch((error) => {
				console.log(error);
			});
	};

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	return (
		<React.Fragment>
			<Box
				sx={{
					width: { windowWidth },
					marginTop: "40vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}
			>
				<Stack
					sx={{ alignSelf: "center", alignItems: "center" }}
					spacing={1}
					direction="column"
				>
					<CircularProgress sx={{ marginBottom: "5%" }} />
					<Typography>
						Versuche dem Event als Organisator beizutreten...
					</Typography>
				</Stack>
			</Box>
		</React.Fragment>
	);
}

export default JoinO;
