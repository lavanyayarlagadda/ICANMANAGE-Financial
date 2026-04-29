
import { Box, Typography, Container } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {
    TermsBackground,
    TermsCard,
    TermsHeader,
    TermsContent,
    SectionTitle,
    SectionText,
    BackButton
} from './TermsPage.styles';

const TermsPage = () => {
    const navigate = useNavigate();

    return (
        <TermsBackground>
            <Container maxWidth="md">
                <Box sx={{ py: 6 }}>
                    <BackButton
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </BackButton>

                    <TermsCard>
                        <TermsHeader>
                            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                                Terms and Conditions
                            </Typography>
                        </TermsHeader>

                        <TermsContent>
                            <SectionText sx={{ mb: 4, fontStyle: 'italic', fontSize: '1.1rem', color: 'text.primary' }}>
                                In using this website, you are deemed to have read and agreed to the following terms and conditions:
                            </SectionText>

                            <SectionTitle variant="h5">Terminology</SectionTitle>
                            <SectionText>
                                The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and any or all Agreements: <strong>"Client"</strong>, <strong>“You”</strong> and <strong>“Your”</strong> refers to you, the person accessing this website and accepting the Company’s terms and conditions. <strong>"The Company"</strong>, <strong>“Ourselves”</strong>, <strong>“We”</strong> and <strong>"Us"</strong>, refers to our Company. <strong>“Party”</strong>, <strong>“Parties”</strong>, or <strong>“Us”</strong>, refers to either the Client or ourselves. All terms refer to the offer, acceptance, and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner, whether by formal meetings of a fixed duration or any other means, for the express purpose of meeting the Client’s needs in respect of the provision of the Company’s stated services/products, following and subject to, prevailing American Law. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same.
                            </SectionText>

                            <SectionText>
                                We will not sell, share, or rent your personal information to any third party or use your e-mail address for unsolicited mail. Any emails sent by this Company will only be in connection with the provision of agreed services and products.
                            </SectionText>

                            <SectionTitle variant="h5">General</SectionTitle>
                            <SectionText>
                                The laws of the United States of America govern these terms and conditions. By accessing this website and using our services you consent to these terms and conditions and the exclusive jurisdiction of the USA courts in all disputes arising out of such access. If any of these terms are deemed invalid or unenforceable for any reason (including, but not limited to the exclusions and limitations set out above), then the invalid or unenforceable provision will be severed from these terms and the remaining terms will continue to apply. Failure of the Company to enforce any of the provisions set out in these Terms and Conditions and any Agreement, or failure to exercise any option to terminate, shall not be construed as a waiver of such provisions and shall not affect the validity of these Terms and Conditions or any Agreement or any part thereof, or the right thereafter to enforce every provision. These Terms and Conditions shall not be amended, modified, varied or supplemented except in writing and signed by duly authorized representatives of the Company.
                            </SectionText>

                            <SectionTitle variant="h5">Privacy Statement</SectionTitle>
                            <SectionText>
                                We are registered under the Data Protection Act 1998 and as such, any information concerning the Client and their respective Client Records may be passed to third parties. However, Client records are regarded as confidential and therefore will not be divulged to any third party, other than [our manufacturer/supplier(s) and] if legally required to do so to the appropriate authorities. Clients have the right to request sight of, and copies of any and all Client Records we keep, on the proviso that we are given reasonable notice of such a request. Clients are requested to retain copies of any literature issued in relation to the provision of our services. Where appropriate, we shall issue Client’s with appropriate written information, handouts or copies of records as part of an agreed contract, for the benefit of both parties.
                            </SectionText>

                            <SectionTitle variant="h5">Confidentiality</SectionTitle>
                            <SectionText>
                                We are registered under the Data Protection Act 1998. We are a covered entity and are permitted, but not required, to use and disclose protected health information, without an individual’s authorization, for the following purposes or situations: (1) To the Individual (unless required for access or accounting of disclosures); (2) Treatment, Payment, and Health Care Operations; (3) Opportunity to Agree or Object; (4) Incident to an otherwise permitted use and disclosure; (5) Public Interest and Benefit Activities; and (6) Limited Data Set for research, public health or health care operations. covered entities may rely on professional ethics and best judgments in deciding which of these permissive uses and disclosures to make.
                            </SectionText>

                            <SectionTitle variant="h5">Cookies</SectionTitle>
                            <SectionText>
                                Like most interactive web sites this Company’s website [or ISP] uses cookies to enable us to retrieve user details for each visit. Cookies are used in some areas of our site to enable the functionality of this area and ease of use for those people visiting. Some of our affiliate partners may also use cookies.
                            </SectionText>

                            <SectionTitle variant="h5">Log Files</SectionTitle>
                            <SectionText>
                                We use IP addresses to analyze trends, administer the site, track user’s movement, and gather broad demographic information for aggregate use. IP addresses are not linked to personally identifiable information. Additionally, for systems administration, detecting usage patterns and troubleshooting purposes, our web servers automatically log standard access information including browser type, access times/open mail, URL requested, and referral URL. This information is not shared with third parties and is used only within this Company on a need-to-know basis. Any individually identifiable information related to this data will never be used in any way different to that stated above without your explicit permission.
                            </SectionText>

                            <SectionText>
                                This Company’s logo is a registered trademark of this Company in the United State of America and other countries. The brand names and specific services of this Company featured on this web site are trademarked.
                            </SectionText>

                            <SectionTitle variant="h5">Links to this website</SectionTitle>
                            <SectionText>
                                You may not create a link to any page of this website without our prior written consent. If you do create a link to a page of this website, you do so at your own risk and the exclusions and limitations set out above will apply to your use of this website by linking to it.
                            </SectionText>

                            <SectionTitle variant="h5">Copyright Notice</SectionTitle>
                            <SectionText>
                                Copyright and other relevant intellectual property rights exist on all text relating to the Company’s services and the full content of this website.
                            </SectionText>

                            <Box sx={{ mt: 6, p: 4, bgcolor: 'action.hover', borderRadius: 2, borderLeft: '4px solid', borderColor: 'primary.main' }}>
                                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                                    These terms and conditions form part of the Agreement between the Client and ourselves. Your accessing of this website indicates your understanding, agreement to and acceptance, of the Disclaimer Notice and the full Terms and Conditions contained herein.
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 6, textAlign: 'center' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.05em', fontWeight: 600 }}>
                                    © COGNITIVEHEALTH  - {new Date().getFullYear()} ALL RIGHTS RESERVED
                                </Typography>
                            </Box>
                        </TermsContent>
                    </TermsCard>
                </Box>
            </Container>
        </TermsBackground>
    );
};

export default TermsPage;
