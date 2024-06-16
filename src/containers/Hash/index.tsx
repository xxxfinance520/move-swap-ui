import { ConnectButton } from "@mysten/dapp-kit";
import { Box,  Container, Flex, Grid, Heading } from "@radix-ui/themes";
// import { PlayerSesh } from "./containers/Player/PlayerSesh";
// import { HouseSesh } from "./containers/House/HouseSesh";
import { CalHash } from "./CalHash";



export function HashIndex() {
  return (
    <>
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>hash gas测试</Heading>
        </Box>
        <Box>
          <ConnectButton />
        </Box>
      </Flex>
      <Container>
      <Grid columns="2" gap={"3"} width={"auto"}>
            {/* <PlayerSesh />
            <HouseSesh /> */}
            <CalHash />
          </Grid>
      </Container>
    </>
  );
}
