function Test-PSScript
{
    param(
        [Parameter(Mandatory=$true, Position=0, ValueFromPipeline=$true, ValueFromPipelineByPropertyName=$true)]
        [ValidateNotNullOrEmpty()]
        [Alias('PSPath', 'FullName')]
        [System.String[]] $FilePath,
        [Switch]$IncludeSummaryReport
    )
    begin
    {
        $total=$fails=0
    }
    process
    {
        $FilePath|ForEach-Object{
            if(Test-Path -Path $_ -PathType Leaf)
            {
                $Path = Convert-Path -Path $_
                $Errors = $null
                $Content = Get-Content -Path $Path
                $Tokens = [System.Management.Automation.PSParser]::Tokenize($Content, [ref] $Errors)
                if ($Errors) 
                {
                    $fails+=1
                    $Errors|ForEach-Object{
                        $_.Token|Add-Member -MemberType NoteProperty -Name Path -Value $Path -PassThru|Add-Member -MemberType NoteProperty -Name ErrorMessage -Value $_.Message -PassThru
                    }
                }
                $total+=1
            }
        }
    }
    end
    {
        if ($IncludeSummaryReport)
        {
            Write-Host "$total script(s) processed, $fails script(s) contain syntax errors."
        }
    }
}