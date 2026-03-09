import React from 'react';
import { Check } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { CycleSyncingStyles } from './CycleSyncing.styles';

const benefits = [
    {
        title: "Less period pain & bloating",
        links: [
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC4794546/",
            "https://academic.oup.com/nutritionreviews/article/83/2/280/7659847"
        ]
    },
    {
        title: "Steadier energy & fewer crashes",
        links: [
            "https://pubmed.ncbi.nlm.nih.gov/10071420/",
            "https://www.nature.com/articles/s42255-023-00869-w"
        ]
    },
    {
        title: "Better moods & fewer PMS swings",
        links: [
            "https://pmc.ncbi.nlm.nih.gov/articles/PMC10998471/",
            "https://www.frontiersin.org/journals/endocrinology/articles/10.3389/fendo.2020.00311/full"
        ]
    }
];

export const BenefitsList = () => {
    return (
        <div className={CycleSyncingStyles.benefits.listContainer}>
            {benefits.map((item, i) => (
                <div key={i} className={CycleSyncingStyles.benefits.itemContainer}>
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className={CycleSyncingStyles.benefits.button}>
                                <div className={CycleSyncingStyles.benefits.checkWrapper}>
                                    <Check className={CycleSyncingStyles.benefits.checkIcon} strokeWidth={4} />
                                </div>
                                <span>{item.title}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className={CycleSyncingStyles.benefits.popoverContent}>
                            <div className="space-y-2">
                                <h4 className={CycleSyncingStyles.headings.evidenceTitle}>Scientific Evidence</h4>
                                {item.links.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={CycleSyncingStyles.text.evidenceLink}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Source {idx + 1}
                                    </a>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            ))}
        </div>
    );
};
