import { Grid, Stack } from "@mantine/core";

import { Offer, OfferState } from "../../../types";
import { JobInfo } from "./JobInfo";
import { JobPostulations } from "./JobPostulations";
import { FinishJob } from "./FinishJob";

interface CompanyViewProps {
    offer: Offer;
    onGetOffer: () => Promise<void>;
}

export const CompanyView = ({ offer, onGetOffer }: CompanyViewProps) => {
    return (
        <Grid>
            <Grid.Col span={{ base: 12, md: (offer.state == OfferState.active) ? 8 : 12 }} >
                <Stack>
                    <JobInfo
                        offer={offer}
                        onGetOffer={onGetOffer} />
                    <JobPostulations
                        offerId={offer.offer_id}
                        offerState={offer?.state} />
                </Stack>
            </Grid.Col>
            {offer.state == OfferState.active &&
                <Grid.Col span={{ base: 12, md: 4 }}>
                    <FinishJob offerId={offer.offer_id} />
                </Grid.Col>
            }
        </Grid>
    )
}